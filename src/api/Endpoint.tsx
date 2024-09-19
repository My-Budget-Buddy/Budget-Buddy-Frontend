let url = "http://localhost:8125";

const env = import.meta.env.MODE;
if (env === 'production') {
    url = "api.skillstorm-congo.com";
}

// Base URL for the backend API
export const URL = url;