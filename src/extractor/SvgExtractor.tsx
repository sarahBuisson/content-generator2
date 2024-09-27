import { ImportImageFromFile, ImportImageFromURL, TakePhoto } from './Uploaders';

import TogglableWrapper from '../components/TogglableWrapper';
import { useState } from 'react';
import { reduceAndFormatImage } from '../service/processImage';
import * as ImageTracer from 'imagetracerjs';

export function SvgExtractor() {

    const [image, setImage] = useState<File>()
    const [svg, setSvg] = useState()

    function onHandleImage(image: File) {
        console.log(image)
        setImage(image);
    }

    function onProcessImage() {
        reduceAndFormatImage(image!!, 150, 200,
            'jpeg', (reducedFile) => {
                const reader = new FileReader();
                reader.onloadend = () => {

                    ImageTracer.imageToSVG(
                        reader.result as string,
                        (svgstr: string) => setSvg(svgstr),
                        // 'posterized2'
                        {numberofcolors: 2, linefilter: true, roundcoords: 0.001}
                    );
                };
                reader.readAsDataURL(reducedFile);

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
            {svg && <div dangerouslySetInnerHTML={{__html: svg}}/>}
        </div>
    )

}
