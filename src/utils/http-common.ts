import axios from 'axios';
import axiosRetry from 'axios-retry';

const client = axios.create({
  baseURL: 'https://norma.nomoreparties.space/api',
  headers: {
    'Content-type': 'application/json'
  }
});

axiosRetry(client);

export default client;