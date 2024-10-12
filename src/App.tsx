import './App.css'
import { SvgExtractor } from './extractor/SvgExtractor.tsx';
import { GitHubLoginButton } from './save/GitHubLoginButton.tsx';

const onSuccess = response => {
    console.log(response);
};
const onFailure = response => {
    console.error(response);
};



function App() {
    return (
        <>
       <GitHubLoginButton/>
            <SvgExtractor/>
        </>
    )
}

export default App
