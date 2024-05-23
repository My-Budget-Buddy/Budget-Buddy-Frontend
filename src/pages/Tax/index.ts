import axios from "axios";
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

const apiClient = axios.create({
    // hiding the URL in the .env file
    baseURL: `/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

apiClient.defaults.withCredentials = true;

// // Currently not using this interceptor
// apiClient.interceptors.request.use((config) => {
//     // const token = cookies.get('token');
//     // if (token) {
//     //     config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
// });

export default apiClient;
