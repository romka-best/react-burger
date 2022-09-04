import {TypedUseSelectorHook, useDispatch as dispatchHook, useSelector as selectorHook} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit'

import {AppDispatch, RootState} from '../utils/types';

import {socketMiddleware} from './middleware';

import {wsOrdersActions, wsOrdersAllActions} from './slices/order';
import rootReducer from './slices/index';

const WS_URL_BASE: string = 'wss://norma.nomoreparties.space'
const WS_URL_ORDERS: string = `${WS_URL_BASE}/orders`;
const WS_URL_ORDERS_ALL: string = `${WS_URL_BASE}/orders/all`;

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(socketMiddleware(WS_URL_ORDERS, wsOrdersActions, true))
      .concat(socketMiddleware(WS_URL_ORDERS_ALL, wsOrdersAllActions, false))
});

export const useAppDispatch = () => dispatchHook<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

