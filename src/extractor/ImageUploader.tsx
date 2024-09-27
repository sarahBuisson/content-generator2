import { useState } from 'react';
import * as ImageTracer from 'imagetracerjs';
import ImageTracerForm from './ImageTracerForm';
import { reduceAndFormatImage } from '../service/processImage';

function handleImage(file: File, setImageSrc: (value: (((prevState: (string | ArrayBuffer | null)) => (string | ArrayBuffer | null)) | string | ArrayBuffer | null)) => void, setSvgContent: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void, setSvgContent2: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void) {
    console.log("handleImage", file)
    reduceAndFormatImage(file, 150, 200, 'jpeg', (reducedFile) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result);

            ImageTracer.imageToSVG(
                reader.result as string,
                (svgstr: string) => setSvgContent(svgstr),
                // 'posterized2'
                {numberofcolors: 2, linefilter: true, roundcoords: 0.001}
            );
        };
        reader.readAsDataURL(reducedFile);
    });
}

export default function ImageUploader() {
    const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [svgContent2, setSvgContent2] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImage(file, setImageSrc, setSvgContent);
            handleImage(file, setImageSrc, setSvgContent2);
        }
    };
    console.log(svgContent && svgContent.length)
    console.log(svgContent2 && svgContent2.length)
    return (
        <div>
            <h1>Upload an Image</h1>
            <input type="file" accept="image/*" onChange={handleImageChange}/>
            {imageSrc && <img src={imageSrc as string} alt="Uploaded"/>}
            <ImageTracerForm></ImageTracerForm>
            {svgContent && <div dangerouslySetInnerHTML={{__html: svgContent}}/>}
            {svgContent2 && <div dangerouslySetInnerHTML={{__html: svgContent2}}/>}
        </div>
    );
}
