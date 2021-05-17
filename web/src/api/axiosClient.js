import axios from 'axios';
import { AUTHORIZATION_TOKEN } from './constant';

const baseURL = 'http://localhost:3000';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${AUTHORIZATION_TOKEN}`
    }
})

export default axiosClient;