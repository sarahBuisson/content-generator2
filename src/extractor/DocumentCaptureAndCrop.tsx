import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const DocumentCaptureAndCrop: React.FC<{ onHandleImage: (file: File) => void }> = ({ onHandleImage }) => {
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>({ x:0,y:0,unit: '%', width: 100,height: 100, });
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImageSrc(imageSrc);
        }
    }, [webcamRef]);

    const onCropComplete = async (crop: Crop) => {
        if (imageSrc && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(imageSrc, crop);
            setCroppedImageUrl(croppedImageUrl);

        }
    };

    const getCroppedImg = (imageSrc: string, crop: Crop): Promise<string> => {
        const image = new Image();
        image.src = imageSrc;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        return new Promise((resolve) => {
            image.onload = () => {
                if (!ctx) return;

                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;
                canvas.width = crop.width;
                canvas.height = crop.height;

                ctx.drawImage(
                    image,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width,
                    crop.height
                );

                canvas.toBlob((blob) => {
                    if (blob) {
                        const fileUrl = URL.createObjectURL(blob);
                        resolve(fileUrl);
                    }
                    if (blob) {
                        const file = new File([blob], 'photo.jpg', {type: 'image/jpeg'});
                        onHandleImage(file);
                    }
                }, 'image/jpeg');
            };
        });
    };

    const handleCrop = () => {
        if (croppedImageUrl) {
            fetch(croppedImageUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
                    onHandleImage(file);
                });
        }
    };

    return (
        <div>
            {!imageSrc ? (
                <div>
                    <Webcam
                        audio={false}
                        videoConstraints={{
                            facingMode: {exact: "environment"}
                        }}
                        capture={"environment"}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="300px"
                    />
                    <button onClick={capture}>Capture</button>
                </div>
            ) : (
                <div>
                        <ReactCrop
                        crop={crop}
                        onChange={newCrop => setCrop(newCrop)}
                        onComplete={onCropComplete}
                        >
                            <img src={imageSrc} />

                        </ReactCrop>
                    <button onClick={handleCrop}>Crop</button>
                    {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}
                </div>
            )}
        </div>
    );
};

export default DocumentCaptureAndCrop;
