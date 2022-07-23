import {combineReducers} from '@reduxjs/toolkit';

import {userReducer} from './user';
import {modalReducer} from './modal';
import {ingredientsReducer} from './ingredients';
import {burgerConstructorReducer} from './burgerConstructor';
import {orderReducer} from './order';
import {wsReducer} from './ws';
import {uiReducer} from './ui';


const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  ws: wsReducer,
  ui: uiReducer,
});

export default rootReducer;
