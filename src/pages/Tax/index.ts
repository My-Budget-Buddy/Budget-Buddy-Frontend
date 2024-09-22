import axios from "axios";
import Cookies from "js-cookie";
//const jwtCookie = Cookies.get("jwt");

import { URL } from "../../api/Endpoint";

const apiClient = axios.create({
    // hiding the URL in the .env file
    baseURL: URL,
    headers: {
        "Content-Type": "application/json"
    }
});

apiClient.defaults.withCredentials = true;

apiClient.interceptors.request.use((config) => {
    const jwtCookie = Cookies.get("jwt");
    if (jwtCookie) {
        config.headers.Authorization = `Bearer ${jwtCookie}`;
    }
    return config;
});

export default apiClient;
