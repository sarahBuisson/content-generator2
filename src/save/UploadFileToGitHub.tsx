// src/save/UploadFileToGitHub.tsx
import React, { useState } from 'react';
import axios from 'axios';

export function UploadFileToGitHub({token}: { token: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [user, setUser] = useState<string>("sarahBuisson");
    const [repo, setRepo] = useState<string>("content-generator2");
    const [path, setPath] = useState<string>("src/assets");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}/${file.name}`;
        console.log(url)
        let content = await file.text();
        console.log(content)
        try {
            content = btoa(content);
        } catch (e) {
            console.error(e);

        }


        const response = await axios.put('https://cors-anywhere.herokuapp.com/'+
            url,
            {
                message: `Add ${file.name}`,
                content: content
            },
            {
                headers: {
                    Authorization: `token ${token}`
                }
            }
        );

        console.log(response.data);
    };

    return (
        <div>
            <ul>
                <li>
                    <input type="file" onChange={handleFileChange}/></li>
                <li> user: <input value={user} onChange={(event => setUser(event.target.value))}/>
                </li>
                <li> repo:<input value={repo} onChange={(event => setRepo(event.target.value))}/>
                </li>
                <li><input value={path} onChange={(event => setPath(event.target.value))}/>
                </li>
                <li>

                    <button onClick={handleUpload}>Upload to GitHub</button>

                </li>
            </ul>
        </div>
    );
}
