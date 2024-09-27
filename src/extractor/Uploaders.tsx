import React, { useRef } from 'react';

// Component to take a photo using the device camera
export const TakePhoto: React.FC<{ onHandleImage: (file: File) => void }> = ({onHandleImage}) => {
    const videoReference = useRef<HTMLVideoElement>(null);
    const canvasReference = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        if (videoReference.current) {
            videoReference.current.srcObject = stream;
        }
    };

    const takePhoto = () => {
        if (canvasReference.current && videoReference.current) {
            const context = canvasReference.current.getContext('2d');
            if (context) {
                context.drawImage(videoReference.current, 0, 0, canvasReference.current.width, canvasReference.current.height);
                canvasReference.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'photo.jpg', {type: 'image/jpeg'});
                        onHandleImage(file);
                    }
                }, 'image/jpeg');
            }
        }
    };

    return (
        <div>
            <video ref={videoReference} autoPlay width="300" height="200"/>
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={takePhoto}>Take Photo</button>
            <canvas ref={canvasReference} style={{display: 'none'}} width="300" height="200"/>
        </div>
    );
};

// Component to import an image from the local file system
export const ImportImageFromFile: React.FC<{ onHandleImage: (file: File) => void }> = ({onHandleImage}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onHandleImage(file);
        }
    };

    return (
        <div>

            {/* eslint-disable-next-line react/jsx-handler-names */}
            <input type="file" accept="image/*" onChange={handleFileChange}/>
        </div>
    );
};

// Component to import an image from a URL
export const ImportImageFromURL: React.FC<{ onHandleImage: (file: File) => void }> = ({onHandleImage}) => {
    const [url, setUrl] = React.useState('');

    const handleImport = async () => {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', {type: 'image/jpeg'});
        onHandleImage(file);
    };

    return (
        <div>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter image URL"/>
            <button onClick={handleImport}>Import Image</button>
        </div>
    );
};
