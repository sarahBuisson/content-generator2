export function reduceAndFormatImage(file: File,
                                     maxWidth: number, maxHeight: number,
                                     format: string,
                                     callback: (reducedFile: File) => void) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const reducedFile = new File([blob], file.name, {type: `image/${format}`});
                    callback(reducedFile);
                }
            }, `image/${format}`);
        };
        img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
}
