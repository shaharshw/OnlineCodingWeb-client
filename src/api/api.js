import axios from "axios";

const API_BASE_URL = 'https://onlinecodingweb-server.onrender.com/api/';

const apiClient= axios.create(
    {
        baseURL: API_BASE_URL
    }
);

export default apiClient


