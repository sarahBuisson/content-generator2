import { useRef, useState } from 'react';

export default function CameraCapture() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [device, setDevice] = useState<string | null>("JSON");
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            setDevice(JSON.stringify(devices));
            const stream = await navigator.mediaDevices.getUserMedia({  video:  { facingMode: {ideal:"environment" }}});
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                setImageSrc(canvasRef.current.toDataURL('image/png'));
            }
        }
    };

    return (
        <div>
            {device}
            <h1>Take a Photo</h1>
            <button onClick={startCamera}>Start Camera</button>
            <div>
                <video ref={videoRef} style={{display: imageSrc ? 'none' : 'block'}}/>
                <canvas ref={canvasRef} style={{display: 'none'}} width="640" height="480"/>
            </div>
            <button onClick={capturePhoto}>Capture Photo</button>
            {imageSrc && <img src={imageSrc} alt="Captured"/>}
        </div>
    );
}
