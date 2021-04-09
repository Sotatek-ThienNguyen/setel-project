import axios from 'axios';

const baseURL = 'http://localhost:3000';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'content-type': 'application/json',
    }
})

export default axiosClient;