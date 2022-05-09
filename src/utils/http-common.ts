import axios from 'axios';

export default axios.create({
  baseURL: 'https://norma.nomoreparties.space/api',
  headers: {
    'Content-type': 'application/json'
  }
});