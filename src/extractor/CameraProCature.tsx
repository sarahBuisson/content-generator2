"use client";


import React, { useRef, useState } from "react";
import { Camera, CameraType } from "react-camera-pro";
import { Flex } from '@chakra-ui/react';

const CameraProCapture: React.FC<{ onHandleImage: (file: File) => void }> = ({onHandleImage}) => {
    const [numberOfCameras, setNumberOfCameras] = useState(0);
    const [imageSrc, setImageSrc] = useState<string | null>("some.jpg");
    const camera = useRef<CameraType>(null);
    const canvasReference = useRef<HTMLCanvasElement>(null);
    const imgCapturedRef = useRef<HTMLImageElement>(null);

    const captureMenu = [
        {
            action: () => {
                if (camera.current) {
                    camera.current.switchCamera();
                }
            },
            label: "Switch",
        },
        {
            action: () => {
                if (camera.current) {
                    camera.current.toggleTorch();
                }
            },
            label: "Torch",
        },
    ];

    function takePicture() {
        if (camera.current) {
            const photo = camera.current.takePhoto();
            setImageSrc(photo as string);
            const context = canvasReference?.current?.getContext('2d');
            if (context && canvasReference?.current) {
                context.drawImage(imgCapturedRef?.current as CanvasImageSource, 0, 0, canvasReference.current.width, canvasReference.current.height);
                canvasReference?.current?.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'photo.jpg', {type: 'image/jpeg'});
                        onHandleImage(file);
                    }
                }, 'image/jpeg');
            }

        }
    }

    if (imageSrc) {
        return (
            <>
                <div className="absolute top-10 w-full flex justify-between">
                    <button
                        className="w-16 h-16 bg-white rounded-full"
                        onClick={() => setImageSrc(null)}

                    >clear</button>
                </div>
                <img style={{objectFit: "cover", width: "100px"}} src={imageSrc}/>
                <div className="absolute bottom-10">
                    <button>Simpan</button>
                </div>
            </>
        );
    } else {
        return (
            <> <button

                onClick={() => {
                    takePicture();
                }}
            >takePicture2</button>
                <div className=" top-10 left-5 z-10"> captureMenu
                    {captureMenu.map((res) => (
                        <button
                            key={res.label}
                            className="w-16 h-16 bg-white rounded-full basis-1/3"
                            disabled={res.label === "Switch" && numberOfCameras <= 1}
                            onClick={res.action}
                        >switch
                            {res.label}
                        </button>
                    ))}
                    <button

                        onClick={() => {
                            takePicture();
                        }}
                    >takePicture2</button>
                </div>
                <button

                    onClick={() => {
                        takePicture();
                    }}
                >takePicture2</button>
                <Flex>
                <Camera
                    ref={camera}
                    facingMode="environment"
                    numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
                    errorMessages={{
                        noCameraAccessible:
                            "No camera device accessible. Please connect your camera or try a different browser.",
                        permissionDenied:
                            "Permission denied. Please refresh and give camera permission.",
                        switchCamera:
                            "It is not possible to switch camera to different one because there is only one video device accessible.",
                        canvas: "Canvas is not supported.",
                    }}
                    videoReadyCallback={() => {
                        console.log("Video feed ready.");
                    }}
                />
                </Flex>
                <div className=" bottom-10 flex w-full justify-center">
                  BUU  <button
                        className="w-16 h-16 bg-white rounded-full"
                        onClick={() => {
                            takePicture();
                        }}
                    >takePicture</button>
                    {imageSrc && <img src={imageSrc} alt="Captured" ref={imgCapturedRef}/>}
                    <canvas ref={canvasReference} style={{display: 'none'}} width="30px" height="20px"/>

                </div>
                <button

                    onClick={() => {
                        takePicture();
                    }}
                >takePicture2</button>
            </>
        );
    }
};

export default CameraProCapture;
