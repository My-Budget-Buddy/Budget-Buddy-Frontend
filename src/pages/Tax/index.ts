import axios from "axios";
import Cookies from "js-cookie";
//const jwtCookie = Cookies.get("jwt");

const apiClient = axios.create({
    // hiding the URL in the .env file
    baseURL: `http://localhost:8125`,
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
