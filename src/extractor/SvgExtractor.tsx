import { ImportImageFromFile, ImportImageFromURL, TakePhoto } from './Uploaders';

import TogglableWrapper from '../components/TogglableWrapper';
import { useRef, useState } from 'react';
import { fileToImageData } from '../service/processImage';
import { ImageTracer } from '@image-tracer-ts/core';

export function SvgExtractor() {
    const canvasRef = useRef(null);
    const [image, setImage] = useState<File>()
    const [svg, setSvg] = useState("<svg>nothing</svg>")

    function onHandleImage(image: File) {
        console.log("image", image)
        setImage(image);
    }

    function onProcessImage() {

        fileToImageData(image!, 150, 200).then((imageData) => {

            const canvas: any = canvasRef.current;
            canvas.width = 512;
            canvas.height = 256;
            const context = canvas.getContext("2d");
            context.putImageData(imageData, 0, 0)
            const tracer = new ImageTracer()

            const svgstr = tracer.traceImage(
                imageData

                // 'posterized2'

            );
            setSvg(svgstr)


        });
    }


    return (
        <div>
            <h1>SVG Extractor</h1>
            <TogglableWrapper title="from url">
                <ImportImageFromURL onHandleImage={onHandleImage}/>
            </TogglableWrapper>
            <TogglableWrapper title="from photo">
                <TakePhoto onHandleImage={onHandleImage}/>
            </TogglableWrapper>
            <TogglableWrapper title="from file">
                <ImportImageFromFile onHandleImage={onHandleImage}/>
            </TogglableWrapper>


            <button onClick={onProcessImage}>process image</button>
            <canvas ref={canvasRef}/>
            {svg && <div dangerouslySetInnerHTML={{__html: svg}}/>}
        </div>
    )

}

