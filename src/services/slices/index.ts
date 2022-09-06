import {combineReducers} from '@reduxjs/toolkit';

import {userReducer} from './user';
import {modalReducer} from './modal';
import {ingredientsReducer} from './ingredients';
import {burgerConstructorReducer} from './burgerConstructor';
import {orderReducer, wsOrdersAllReducer, wsOrdersReducer} from './order';
import {uiReducer} from './ui';


const rootReducer =
  combineReducers({
    user: userReducer,
    modal: modalReducer,
    ingredients: ingredientsReducer,
    burgerConstructor: burgerConstructorReducer,
    order: orderReducer,
    wsOrders: wsOrdersReducer,
    wsOrdersAll: wsOrdersAllReducer,
    ui: uiReducer,
  });

export default rootReducer;
