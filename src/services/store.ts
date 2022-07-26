import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit'

import {ReducersParams} from '../utils/types';

import {socketMiddleware} from './middleware';

import {wsOrdersActions, wsOrdersAllActions} from './slices/order';
import rootReducer from './slices/index';

const WS_URL_BASE = 'wss://norma.nomoreparties.space'
const WS_URL_ORDERS = `${WS_URL_BASE}/orders`;
const WS_URL_ORDERS_ALL = `${WS_URL_BASE}/orders/all`;

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(socketMiddleware(WS_URL_ORDERS, wsOrdersActions, true))
      .concat(socketMiddleware(WS_URL_ORDERS_ALL, wsOrdersAllActions, false))
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReducersParams> = useSelector;

