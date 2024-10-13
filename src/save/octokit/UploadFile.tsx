// src/components/UploadFile.tsx
import React, { useState } from 'react';

import { Octokit } from '@octokit/rest';

const UploadFile = ({token, initFile}: { token: string, initFile: string|null }) => {

    const octokit = new Octokit({
        auth: token
    });

    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState(''+initFile);

    const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
    };

    const handleFileContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFileContent(event.target.value);
    };

    const handleUpload = async () => {
        try {
            const response = await octokit.repos.createOrUpdateFileContents({
                owner: 'sarahBuisson',
                repo: 'content-generator2',
                path: fileName,
                message: `Create ${fileName}`,
                content: btoa(fileContent),
            });
            console.log('File created:', response.data);
        } catch (error) {
            console.error('Error creating file:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="File name"
                value={fileName}
                onChange={handleFileNameChange}
            />
            <textarea
                placeholder="File content"
                value={fileContent}
                onChange={handleFileContentChange}
            />
            <button onClick={handleUpload}>Upload File</button>
        </div>
    );
};

export default UploadFile;
