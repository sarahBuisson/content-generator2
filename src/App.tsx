import { Button, ChakraProvider, Flex, Link, Text } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { clientId, clientSecret } from './Constant.ts';
import { ImportImageFromFile, ImportImageFromURL, TakePhoto } from './extractor/Uploaders.tsx';
import { fileToImageData } from './service/processImage.ts';
import { ImageTracer, Options } from '@image-tracer-ts/core';
import { GitHubLoginButton } from './save/GitHubLoginButton.tsx';
import DocumentCaptureAndCrop from './extractor/DocumentCaptureAndCrop.tsx';

const GitAuthentificator = function ({onSuccess, onFailure}: {
    onSuccess: (data: { access_token: string }) => void,
    onFailure: (error: string) => void
}) {

    const [herokuOk, setHerokuOk] = useState(false)
    const [codeGit, setCodeGit] = useState<string | undefined>(undefined)
    const [token, setToken] = useState<string | undefined>(undefined)
    useEffect(() => {
            axios.get("https://cors-anywhere.herokuapp.com/www.google.com")
                .then((d) => {
                    setHerokuOk(true);
                    return d
                })
                .catch(() => setHerokuOk(false))

        }, [undefined]
    )

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code && herokuOk) {
            setCodeGit(code);

            axios.post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token ',
                {code, client_id: clientId, client_secret: clientSecret},
                ({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }))
                .then(response => {
                    setToken(response.data)
                    onSuccess(response.data)
                })
                .catch(error => onFailure(error));
        }
    }, [onSuccess, onFailure, herokuOk]);

    return <Flex justifyContent="space-around">
        {herokuOk ? <Text>CorsOk</Text> : <Link href="https://cors-anywhere.herokuapp.com/corsdemo">CorsAnywere</Link>}
        {codeGit ? <Text>Code Git Ok</Text> : <Text>CodeGit Ko<GitHubLoginButton></GitHubLoginButton></Text>}
        {token ? <Text>Token Git Ok</Text> : <Text>Token Ko</Text>}

    </Flex>;
}

function ImageImporter({onHandleImage}: {
    onHandleImage: (data: File) => void
}) {
    const [mode, setMode] = useState<string | undefined>()
    return <Flex flexDirection="column" style={{"minHeight":"300px"}}>
        <Flex>
            {mode === "photo" && <TakePhoto onHandleImage={onHandleImage}/>}
            {mode === "photo5" && <DocumentCaptureAndCrop  onHandleImage={onHandleImage}   />}
            {mode === "file" && <ImportImageFromFile onHandleImage={onHandleImage}/>}
            {mode === "url" && <ImportImageFromURL onHandleImage={onHandleImage}/>}
        </Flex>
        <Flex justifyContent="space-around">
            <Button variant="solid" size="md" onClick={() => setMode("photo")}>
                Photo
            </Button>
            <Button variant="solid" size="md" onClick={() => setMode("photo2")}>
            Photo Pro
        </Button>
            <Button variant="solid" size="md" onClick={() => setMode("photo3")}>
           dwt
        </Button><Button variant="solid" size="md" onClick={() => setMode("photo4")}>
           crop
        </Button><Button variant="solid" size="md" onClick={() => setMode("photo5")}>
           crop
        </Button>
            <Button variant="solid" size="md" onClick={() => setMode("file")}>
                File
            </Button>
            <Button variant="solid" size="md" onClick={() => setMode("url")}>
                Url
            </Button>
        </Flex>
    </Flex>;
}

function ImageProcessor({image, handleSvg}: { image: File, handleSvg: (svg: string) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [svg, setSvg] = useState<string>("")

    useEffect(() => {


        fileToImageData(image!, 150, 200).then((imageData) => {

            const canvas: HTMLCanvasElement | null = canvasRef?.current;
            if (canvas) {
                canvas.width = 512;
                canvas.height = 256;
                const context = canvas.getContext("2d");
                if (context) {
                    context.putImageData(imageData, 0, 0);
                }
            }
        });

    }, [image])


    function handleProcess() {
        console.log("handleProcess")
        fileToImageData(image!, 150, 200).then((imageData) => {
            console.log("fileToImageData")
            const canvas: HTMLCanvasElement | null = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext("2d");
                if (context) {
                    context.putImageData(imageData, 0, 0)
                    const tracer = new ImageTracer(Options.Presets.posterized1)

                    const svgstr = tracer.traceImage(
                        imageData
                    );
                    console.log("svgstr", svgstr)
                    setSvg(svgstr)
                    handleSvg(svgstr)
                }
            }

        });
    }

    return <Flex flexDirection="column">
        <Flex>
            <canvas ref={canvasRef} style={{width: "50%"}} width="50%" height="auto"/>
            {svg && <div dangerouslySetInnerHTML={{__html: svg}} style={{width: "50%"}}/>}
        </Flex>
        <Flex>
            <Button variant="solid" size="md" onClick={() => handleProcess()}>
                Process
            </Button>
            <Button variant="solid" size="md">
                Parametrage
            </Button>
        </Flex>
        <Flex/>
    </Flex>;
}

function Saver({fileContent, token}: { fileContent: string | undefined, token: string | undefined }) {
    const [file, setFile] = useState<File | null>(null);
    const [user, setUser] = useState<string>("sarahBuisson");
    const [repo, setRepo] = useState<string>("content-generator2");
    const [path, setPath] = useState<string>("src/assets");
    const [name, setName] = useState<string>("svg.svg");
    const [message, setMessage] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    async function handleSave() {

        console.log("file",file)
        if (!file) return;
        const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}/${name}.svg`;
        console.log(url)
        let content = await file.text();
        console.log(content)
        try {
            content = btoa(content);
            setMessage("Save as " + url)
        } catch (e) {
            console.error(e);
            setMessage("error" + e)

        }


        const response = await axios.put('https://cors-anywhere.herokuapp.com/' +
            url,
            {
                message: `Add ${file.name}`,
                content: fileContent
            },
            {
                headers: {
                    Authorization: `token ${token}`
                }
            }
        );

        console.log(response.data);
    }

    return <Flex>
        <ul>
            <li>
                <input type="hidden" onChange={handleFileChange}/></li>
            <li>user:<input value={user} onChange={(event => setUser(event.target.value))}/>
            </li>
            <li>repo:<input value={repo} onChange={(event => setRepo(event.target.value))}/>
            </li>
            <li>path:<input value={path} onChange={(event => setPath(event.target.value))}/>
            </li>
            <li>name:<input value={name} onChange={(event => setName(event.target.value))}/>
            </li>
            <Button variant="solid" size="md" onClick={handleSave}>
                Save
            </Button>
            {message}
        </ul>

    </Flex>;
}

function App() {
    const [image, setImage] = useState<File>()
    const [svg, setSvg] = useState<string>()
    const [token, setToken] = useState<string>()
    const onSuccess = (data: { access_token: string }) => {
        setToken(data.access_token);
    };
    return <ChakraProvider resetCSS>
        <GitAuthentificator onFailure={console.error} onSuccess={onSuccess}/>
        <ImageImporter onHandleImage={setImage}/>
        {image && <ImageProcessor image={image} handleSvg={setSvg}/>}
        <Saver fileContent={svg} token={token}/>
    </ChakraProvider>;
}

export default App
