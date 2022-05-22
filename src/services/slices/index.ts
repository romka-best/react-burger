import {combineReducers} from '@reduxjs/toolkit';
import {ingredientsReducer} from './ingredients';
import {burgerConstructorReducer} from './burgerConstructor';
import {orderReducer} from './order';
import {uiReducer} from './ui';


const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  ui: uiReducer,
});

export default rootReducer;
