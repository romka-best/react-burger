import axios, {AxiosInstance} from 'axios';
import axiosRetry from 'axios-retry';

const client: AxiosInstance = axios.create({
  baseURL: 'https://norma.nomoreparties.space/api',
  headers: {
    'Content-type': 'application/json'
  }
});

axiosRetry(client);

export default client;