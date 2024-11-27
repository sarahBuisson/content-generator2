import { useEffect, useRef, useState } from "react";
import Dynamsoft from "dwt";
import { WebTwain } from "dwt/dist/types/WebTwain";




export function CameraDwt({onHandleImage}: { onHandleImage: (file: File) => void}){
    //const hasPermission  = useRef('denied');
    const [scanners,setScanners] = useState([] as string[]);
 //   const [ADF,setADF] = useState(false);
  //  const [showUI,setShowUI] = useState(false);
    const dwt = useRef<WebTwain>();
    const [viewMode/*, setViewMode*/] = useState({cols:2,rows:2});
    const [selectedScanner,setSelectedScanner] = useState("");
    //const [selectedPixelType, setSelectedPixelType] = useState(0);
   // const [selectedResolution, setSelectedResolution] = useState(100);

/*
    const scan = () => {
        const DWObject = dwt.current;
        if (DWObject) {
            cont deviceConfiguration:DeviceConfiguration = {};
            deviceConfiguration.IfShowUI = showUI;
            deviceConfiguration.IfFeederEnabled = ADF;
            deviceConfiguration.SelectSourceByIndex = scanners.indexOf(selectedScanner);
            deviceConfiguration.PixelType = selectedPixelType;
            deviceConfiguration.Resolution = selectedResolution;
            console.log(deviceConfiguration);
            DWObject.AcquireImage(deviceConfiguration);
        }
    }

    const save = () => {
        const DWObject = dwt.current;
        if (DWObject) {
            const onSuccess = () => {
              console.log("succes")
            }
            const onFailure = () => {
               console.log("error")
            }
            DWObject.SaveAsJPEG("Documents.jpg",1,onSuccess,onFailure)
            DWObject.SaveAllAsPDF("Documents.pdf",onSuccess,onFailure);
        }
    }

*/

    const onWebTWAINReady = (instance:WebTwain) => {
        dwt.current = instance;
        loadScannersList();
    }

    const onWebTWAINNotFound = async () => {
        console.log("not found");
     //   await message('Dynamsoft Service has not been installed. Please install it and then restart the program.', { title: 'Document Scanner', type: 'warning' });
       // const resourceDirPath = await resourceDir();
       // const distPath = await join(resourceDirPath, 'dist');
        //await open(distPath);
    }

    const loadScannersList = () => {
        const DWObject = dwt.current;
        console.log(DWObject)
        if (DWObject) {
            const names = DWObject.GetSourceNames(false) as string[];
            setScanners(names);
            if (names.length>0) {
                setSelectedScanner(names[0]);
            }
        }
    }
    /*
        const onSelectedScannerChange = (value:string) => {
            setSelectedScanner(value);
        }

        const showImageEditor = () => {
            const DWObject = dwt.current;
            if (DWObject) {
                let imageEditor = DWObject.Viewer.createImageEditor();
                imageEditor.show();
            }
        }
    */
    return (
        <div>
                    <DocumentViewer
                        width="100%"
                        height="100%"
                        onWebTWAINReady={onWebTWAINReady}
                        onWebTWAINNotFound={onWebTWAINNotFound}
                        viewMode={viewMode}
                        onHandleImage={onHandleImage}
                    ></DocumentViewer>

                        Select Scanner:
                        <select
                          //  onChange={onSelectedScannerChange}
                            value={selectedScanner}
                            style={{width:"100%"}}>
                            {scanners.map(scanner =>
                                <option
                                    key={scanner}
                                    value={scanner}
                                >{scanner}</option>
                            )}
                        </select>
                       </div>
    );
}


interface CameraProps {
    license?:string;
    onWebTWAINReady?: (dwt:WebTwain) => void;
    onWebTWAINNotFound?: () => void;
    width?: string;
    height?: string;
    viewMode?: {cols:number,rows:number};
    onHandleImage: (file: File) => void;
}




export const DocumentViewer: React.FC<CameraProps> = (props: CameraProps)  => {
    const containerID = "dwtcontrolContainer";
    const container = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
            const DWObject = Dynamsoft.DWT.GetWebTwain(containerID);
            DWObject.Viewer.width = "100%";
            DWObject.Viewer.height = "100%";
            if (props.width) {
                if (container.current) {
                    container.current.style.width = props.width;
                }
            }
            if (props.height) {
                if (container.current) {
                    container.current.style.height = props.height;
                }
            }
            if (props.onWebTWAINReady) {
                props.onWebTWAINReady(DWObject);
            }
            if (props.viewMode) {
                DWObject.Viewer.setViewMode(props.viewMode.cols,props.viewMode.rows);
            }
        });

        if (props.onWebTWAINNotFound){
            const notfound = () => {
                if (props.onWebTWAINNotFound){
                    props.onWebTWAINNotFound();
                }
            }
            const DynamsoftAny = Dynamsoft;
            DynamsoftAny.OnWebTwainNotFoundOnWindowsCallback = notfound;
            DynamsoftAny.OnWebTwainNotFoundOnMacCallback = notfound;
            DynamsoftAny.OnWebTwainNotFoundOnLinuxCallback = notfound;
        }
        if (props.license) {
            Dynamsoft.DWT.ProductKey = props.license;
        }
        Dynamsoft.DWT.ResourcesPath = "/dwt-resources";
        Dynamsoft.DWT.Containers = [{
            WebTwainId: 'dwtObject',
            ContainerId: containerID
        }];

        Dynamsoft.DWT.Load();
    },[]);

    useEffect(()=>{
        const DWObject = Dynamsoft.DWT.GetWebTwain(containerID);
        if (DWObject && props.viewMode) {
            DWObject.Viewer.setViewMode(props.viewMode.cols,props.viewMode.rows);
        }
    },[props.viewMode]);

    return (
        <div ref={container} id={containerID}></div>
    );
}
