import {combineReducers} from '@reduxjs/toolkit';
import {ingredientsReducer} from './indredients';
import {burgerConstructorReducer} from './burgerConstructor';
import {orderReducer} from './order';


const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer
});

export default rootReducer;
