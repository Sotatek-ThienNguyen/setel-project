import axios from 'axios';

const baseURL = 'http://localhost:3000';

const AUTHORIZATION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjIxMDQ1OTk5LCJleHAiOjE2MjEwODkxOTl9.hEUkOOkNimbAvMZkvBxcZRTif1us4QDwgwow3gsT0Wo';
const axiosClient = axios.create({
    baseURL,
    headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${AUTHORIZATION_TOKEN}`
    }
})

export default axiosClient;