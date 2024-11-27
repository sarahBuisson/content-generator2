import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Cropper, { Area } from 'react-easy-crop';
import { Button } from '@chakra-ui/react';

const PhotoCaptureAndCrop: React.FC<{ onHandleImage: (file: File) => void }> = ({ onHandleImage }) => {
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImageSrc(imageSrc);
        }
    }, [webcamRef]);

    const onCropComplete = useCallback((croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const getCroppedImg = async (imageSrc: string, crop: Area) => {
        const image = new Image();
        image.src = imageSrc;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

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

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(new File([blob], 'cropped_image.png', { type: 'image/png' }));
                }
            }, 'image/png');
        });
    };

    const handleCrop = async () => {
        if (imageSrc && croppedArea) {
            const croppedImage = await getCroppedImg(imageSrc, croppedArea);
            if (croppedImage) {
                onHandleImage(croppedImage);
            }
        }
    };

    return (
        <div>
            {!imageSrc ? (
                <div>
                    <Webcam
                        audio={false}
                        capture={"environment"}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                    />
                    <Button onClick={capture}>Capture</Button>
                </div>
            ) : (
                <div>
                    <div style={{ position: 'relative', width: '100%', height: 400 }}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={4 / 3}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <Button onClick={handleCrop}>Crop</Button>
                </div>
            )}
        </div>
    );
};

export default PhotoCaptureAndCrop;
