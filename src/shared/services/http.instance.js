import axios from 'axios';

const httpInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

httpInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default httpInstance;
