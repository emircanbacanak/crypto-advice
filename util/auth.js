import axios from "axios";

const API_KEY = 'AIzaSyD3KHZKOhadTLlo0_4bWo-f5DDI1owoVbk';

async function authenticated(mode, email, password) {
    const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
        {
            email: email,
            password: password,
            returnSecureToken: true,
        });
    const token = response.data.idToken;
    return token;
}
export function createUser(email, password) {
    return authenticated('signUp', email, password);
}

export function login(email, password) {
    return authenticated('signInWithPassword', email, password);
}