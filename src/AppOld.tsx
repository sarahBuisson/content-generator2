import './App.css'
import { SvgExtractor } from './extractor/SvgExtractor.tsx';
import { GitHubLoginButton } from './save/GitHubLoginButton.tsx';
import { GitHubCallback } from './save/GitHubCallback.tsx';
import { UploadFileToGitHub } from './save/UploadFileToGitHub.tsx';
import { useState } from 'react';
import UploadFile from './save/octokit/UploadFile.tsx';




function AppOld() {
    const [token, setToken] = useState<string | null>(null);
    const [initFile, setInitFile] = useState<string | null>(null);

    const handleSuccess = (data:{access_token:string}) => {
        console.log("handleSuccess", data)
        setToken(data.access_token);
    };

    const handleFailure = (error:string) => {
        console.log("handleFailure", error)
        console.error(error);
    };

    return (
        <>
            {!token ? (
                <>
                    <a href="https://cors-anywhere.herokuapp.com/corsdemo">heroku</a>
                    <GitHubLoginButton />
                    <GitHubCallback onSuccess={handleSuccess} onFailure={handleFailure} />
                </>
            ) : ( <>
                <UploadFileToGitHub token={token} />
                <UploadFile token={token} initFile={initFile}></UploadFile>
                    </>
            )}
            <SvgExtractor handleSvg={setInitFile}/>
        </>
    )
}

export default AppOld
