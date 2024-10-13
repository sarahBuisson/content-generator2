export function GitHubLoginButton() {

    const loginWithGitHub = () => {
        const clientID = 'Iv23liZzMuid1Me3knW8';
        const redirectURI = 'https://sarahbuisson.github.io/content-generator2/';
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    };

    return <button onClick={loginWithGitHub}>Login with GitHub</button>;
}
