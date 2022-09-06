import http from '../utils/http-common';
import {getCookie} from '../utils/functions';

class DataService {
  createUser(email: string, password: string, name: string) {
    return http.post('/auth/register', {
      email,
      password,
      name
    });
  }

  getUserInfo() {
    return http.get('/auth/user', {
      headers: {
        Authorization: 'Bearer ' + getCookie('accessToken')
      }
    });
  }

  updateUserInfo(newValues: object) {
    return http.patch('/auth/user', newValues, {
      headers: {
        Authorization: 'Bearer ' + getCookie('accessToken')
      }
    });
  }

  login(email: string, password: string) {
    return http.post('/auth/login', {
      email,
      password
    });
  }

  logout() {
    return http.post('/auth/logout', {
      token: getCookie('refreshToken')
    });
  }

  updateToken() {
    return http.post('/auth/token', {
      token: getCookie('refreshToken')
    });
  }

  sendCodeForResetPassword(email: string) {
    return http.post('/password-reset', {
      email
    });
  }

  resetPassword(password: string, token: string) {
    return http.post('/password-reset/reset', {
      password,
      token
    });
  }

  getAllIngredients() {
    return http.get('/ingredients');
  }

  createOrder(ingredients: string[]) {
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
