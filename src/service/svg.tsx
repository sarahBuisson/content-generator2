import { RgbColor } from '@image-tracer-ts/core';

export function toSplitedSvg(svgString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const paths = doc.querySelectorAll('path');
    let boundingBoxes: { path: SVGGraphicsElement, rect: DOMRect, groups: SVGGraphicsElement[] }[] = [];

    paths.forEach((path) => {

        const bbox =getBoundingBoxFromSvgPathWithoutGetBBox(path)
        console.log(bbox)
        path.id=JSON.stringify(bbox)
        if(bbox.x==0&& bbox.y==0){
            console.error("ignore this path")
            return;
        }

        boundingBoxes.push({path, rect: bbox, groups: [path]});
    });
    boundingBoxes.pop()// on retire le 1er path

    boundingBoxes.forEach((box1) => {
        boundingBoxes.forEach((box2) => {
            if (box1 != box2) {

                if (doRectsIntersect(box1.rect, box2.rect)) {
                    box1.groups.push(box2.path)
                    box1.groups.push(...box2.groups)
                    box2.groups = []
                }
            }
        });
    });
    boundingBoxes = boundingBoxes.filter((box) => box.groups.length > 0)
    let defs = doc.querySelector('defs');

    if (!defs) {
        defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
        doc.documentElement.appendChild(defs);
    }
    boundingBoxes.forEach((box, index) => {
        const group = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.id = "group" + index
        box.groups.forEach((path) => group.appendChild(path.cloneNode(true)));
        defs?.appendChild(group);

        box.groups.forEach((path) => {
            path.parentNode?.removeChild(path);
        });


        const use = doc.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${group.id}`);
        // Calculate the bounding box that surrounds all paths
        const allBoundingBox = box.groups.reduce((acc, svgElement) => {

         if(svgElement instanceof SVGPathElement ) {
             const rect = getBoundingBoxFromSvgPathWithoutGetBBox(svgElement)
             acc.x = Math.min(acc.x, rect.x);
             acc.y = Math.min(acc.y, rect.y);
             acc.width = Math.max(acc.width, rect.x + rect.width - acc.x);
             acc.height = Math.max(acc.height, rect.y + rect.height - acc.y);
         }
            return acc;
        }, { x: Infinity, y: Infinity, width: 0, height: 0 });

        // Create and append the rectangle
        const rect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', allBoundingBox.x.toString());
        rect.setAttribute('y', allBoundingBox.y.toString());
        rect.setAttribute('width', allBoundingBox.width.toString());
        rect.setAttribute('height', allBoundingBox.height.toString());
        rect.setAttribute('stroke', 'red');
        rect.setAttribute('fill', 'none');
        doc.documentElement.appendChild(rect);
        doc.documentElement.appendChild(use);


    });

    return new XMLSerializer().serializeToString(doc);
}


export function getBoundingBoxesFromSvgPaths(svgString: string): DOMRect[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const paths = doc.querySelectorAll('path');
    const boundingBoxes: DOMRect[] = [];

    paths.forEach((path) => {
        const bbox =getBoundingBoxFromSvgPathWithoutGetBBox(path)
        boundingBoxes.push(bbox);
    });

    return boundingBoxes;
}

export function doRectsIntersect(rect1: DOMRect, rect2: DOMRect): boolean {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

export function groupIntersectingPathsToSvg(svgString: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const paths = Array.from(doc.querySelectorAll('path'));
    const groups: SVGPathElement[][] = [];

    paths.forEach((path) => {
        const bbox = getBoundingBoxFromSvgPathWithoutGetBBox(path)
        let addedToGroup = false;

        for (const group of groups) {
            if (group.some((p) => doRectsIntersect(getBoundingBoxFromSvgPathWithoutGetBBox(p), bbox))) {
                group.push(path);
                addedToGroup = true;
                break;
            }
        }

        if (!addedToGroup) {
            groups.push([path]);
        }
    });

    return groups.map((group) => {
        const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        group.forEach((path) => svgGroup.appendChild(path.cloneNode(true)));
        return svgGroup.outerHTML;
    });
}

export function getBoundingBoxFromSvgPathWithoutGetBBox(path:SVGPathElement): DOMRect {

    if (!path) {
        throw new Error('Invalid SVG path string');
    }

    const d = path.getAttribute('d');
    if (!d) {
        throw new Error('Path has no "d" attribute');
    }

    const commands = d.match(/[a-df-z][^a-df-z]*/ig);
    if (!commands) {
        throw new Error('Invalid path data');
    }

    let x = 0, y = 0;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    commands.forEach(command => {
        const type = command[0];
        const args = command.slice(1).trim().split(/[\s,]+/).map(Number);

        switch (type) {
            case 'M':
            case 'L':
                x = args[0];
                y = args[1];
                break;
            case 'H':
                x = args[0];
                break;
            case 'V':
                y = args[0];
                break;
            case 'C':
                x = args[4];
                y = args[5];
                break;
            case 'S':
            case 'Q':
                x = args[2];
                y = args[3];
                break;
            case 'T':
                x = args[0];
                y = args[1];
                break;
            case 'A':
                x = args[5];
                y = args[6];
                break;
            case 'Z':
                break;
            default:
                throw new Error(`Unsupported path command: ${type}`);
        }

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    });

    return new DOMRect(minX, minY, maxX - minX, maxY - minY);
}

export function useDefsForFillAndStroke(svgString: string, palette: RgbColor[]): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.documentElement;

    const fills = new Set<string>();
    const strokes = new Set<string>();

    // Collect all unique fill and stroke values
    svg.querySelectorAll('[fill]').forEach(el => fills.add(el.getAttribute('fill')!));
    svg.querySelectorAll('[stroke]').forEach(el => strokes.add(el.getAttribute('stroke')!));

    // Create defs element if it doesn't exist
    let defs = svg.querySelector('defs');
    if (!defs) {
        defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
    }

    // Create fill definitions
    fills.forEach((fill, index) => {
        if (fill !== 'none'&&!fill.includes("url")) {
            const fillId = `fill${index}`;
            const fillDef = doc.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            fillDef.setAttribute('id', fillId);
            fillDef.setAttribute('color', getClosestColor(fill, palette));

            defs.appendChild(fillDef);


            // Replace fill attribute with reference to defs
            svg.querySelectorAll(`[fill="${fill}"]`).forEach(el => el.setAttribute('fill', `url(#${fillId})`));
        }
    });

    // Create stroke definitions
    strokes.forEach((stroke, index) => {
        if (stroke !== 'none'&& !stroke.includes("url")) {
            const strokeId = `stroke${index}`;
            const strokeDef = doc.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');


            strokeDef.setAttribute('id', strokeId);
            strokeDef.setAttribute('color', getClosestColor(stroke, palette));

            defs.appendChild(strokeDef);

            // Replace stroke attribute with reference to defs
            svg.querySelectorAll(`[stroke="${stroke}"]`).forEach(el => el.setAttribute('stroke', `url(#${strokeId})`));
        }
    });

    return new XMLSerializer().serializeToString(doc);
}

function getClosestColor(color: RgbColor, palette: RgbColor[]): RgbColor {
    const colorDistance = (c1: RgbColor, c2: RgbColor) => {
        return Math.sqrt(
            Math.pow(c1.r - c2.r, 2) +
            Math.pow(c1.g - c2.g, 2) +
            Math.pow(c1.b - c2.b, 2)
        );
    };

    let closestColor = palette[0];
    let minDistance = colorDistance(color, palette[0]);

    palette.forEach(paletteColor => {
        const distance = colorDistance(color, paletteColor);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = paletteColor;
        }
    });

    return closestColor;
}
