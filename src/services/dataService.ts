import http from '../utils/http-common';

class DataService {
  getAllIngredients() {
    return http.get('/ingredients');
  }

  createOrder(ingredients: string[]) {
    return http.post('/orders', {
      ingredients
    })
  }
}

export default new DataService();
