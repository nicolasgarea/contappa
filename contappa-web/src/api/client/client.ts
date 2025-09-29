import axios from 'axios'

import { API_URL } from '@config/environment'

const client = axios.create({
    baseURL: API_URL
});

export default client;