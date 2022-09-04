import {CombinedState, combineReducers, Reducer} from '@reduxjs/toolkit';

import {userReducer} from './user';
import {modalReducer} from './modal';
import {ingredientsReducer} from './ingredients';
import {burgerConstructorReducer} from './burgerConstructor';
import {orderReducer, wsOrdersAllReducer, wsOrdersReducer} from './order';
import {uiReducer} from './ui';
import {
  TBurgerConstructorState,
  TIngredientsState,
  TModalState,
  TOrderState, TUIState,
  TUserState,
  TWSState
} from '../../utils/types';


const rootReducer: Reducer<CombinedState<{ user: TUserState, modal: TModalState, ingredients: TIngredientsState, burgerConstructor: TBurgerConstructorState, order: TOrderState, wsOrders: TWSState, wsOrdersAll: TWSState, ui: TUIState }>> =
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
