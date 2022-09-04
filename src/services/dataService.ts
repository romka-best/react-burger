import {AxiosResponse} from 'axios';

import http from '../utils/http-common';
import {getCookie} from '../utils/functions';

class DataService {
  createUser(email: string, password: string, name: string): Promise<AxiosResponse> {
    return http.post('/auth/register', {
      email,
      password,
      name
    });
  }

  getUserInfo(): Promise<AxiosResponse> {
    return http.get('/auth/user', {
      headers: {
        Authorization: 'Bearer ' + getCookie('accessToken')
      }
    });
  }

  updateUserInfo(newValues: object): Promise<AxiosResponse> {
    return http.patch('/auth/user', newValues, {
      headers: {
        Authorization: 'Bearer ' + getCookie('accessToken')
      }
    });
  }

  login(email: string, password: string): Promise<AxiosResponse> {
    return http.post('/auth/login', {
      email,
      password
    });
  }

  logout(): Promise<AxiosResponse> {
    return http.post('/auth/logout', {
      token: getCookie('refreshToken')
    });
  }

  updateToken(): Promise<AxiosResponse> {
    return http.post('/auth/token', {
      token: getCookie('refreshToken')
    });
  }

  sendCodeForResetPassword(email: string): Promise<AxiosResponse> {
    return http.post('/password-reset', {
      email
    });
  }

  resetPassword(password: string, token: string): Promise<AxiosResponse> {
    return http.post('/password-reset/reset', {
      password,
      token
    });
  }

  getAllIngredients(): Promise<AxiosResponse> {
    return http.get('/ingredients');
  }

  createOrder(ingredients: string[]): Promise<AxiosResponse> {
    return http.post('/orders', {
      ingredients
    }, {
      headers: {
        Authorization: 'Bearer ' + getCookie('accessToken')
      }
    });
  }
}

export default new DataService();
