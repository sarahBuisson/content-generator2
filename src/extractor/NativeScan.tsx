/*
import DocumentScanner from 'react-native-document-scanner-plugin'
import React, { useEffect, useState } from 'react';

const NativeScan: React.FC<{ onHandleImage: (file: File) => void }> = ({onHandleImage}) => {
    const [scannedImage, setScannedImage] = useState<string>();

    const scanDocument = async () => {
        // start the document scanner
        const {scannedImages} = await DocumentScanner.scanDocument()

        // get back an array with scanned image file paths
        if (scannedImages && scannedImages.length > 0) {
            // set the img src, so we can view the first scanned image
            const url = scannedImages[0];
            setScannedImage(url)
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', {type: 'image/jpeg'});
            onHandleImage(file);
        }
    }

    useEffect(() => {
        // call scanDocument on load
        scanDocument()
    }, []);

    return (
       <div>{scannedImage}</div>
    )
}
export default NativeScan;
*/
