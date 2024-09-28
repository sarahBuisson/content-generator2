import { ImportImageFromFile, ImportImageFromURL, TakePhoto } from './Uploaders';

import TogglableWrapper from '../components/TogglableWrapper';
import { useState } from 'react';
import { fileToImageData } from '../service/processImage';
import { ImageTracer } from '@image-tracer-ts/core';

export function SvgExtractor() {

    const [image, setImage] = useState<File>()
    const [svg, setSvg] = useState("<svg>nothing</svg>")

    function onHandleImage(image: File) {
        console.log("image",image)
        setImage(image);
    }

    function onProcessImage() {

        fileToImageData(image!,150, 200).then((imageData)=>{

                  const tracer =   new ImageTracer({numberOfColors: 3, lineFilter: true})

           const svgstr= tracer.traceImage(
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
            {svg && <div dangerouslySetInnerHTML={{__html: svg}}/>}
        </div>
    )

}

