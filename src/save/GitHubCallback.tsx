// src/save/GitHubCallback.tsx
import  { useEffect } from 'react';
import axios from 'axios';
import { clientId, clientSecret } from '../Constant.ts';

export function GitHubCallback({ onSuccess, onFailure }: { onSuccess: (data: { access_token: string }) => void, onFailure: (error: string) => void }) {
    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
            axios.get('\n' +
                'https://cors-anywhere.herokuapp.com/corsdemo?accessRequest='+Math.random()*10000000)
            axios.post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token ',
                { code, client_id:clientId,client_secret:clientSecret },
                ({headers: { 'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'}}))
                .then(response => onSuccess(response.data))
                .catch(error => onFailure(error));
        }
    }, [onSuccess, onFailure]);

    return <div>Loading...</div>;
}
