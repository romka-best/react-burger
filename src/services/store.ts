import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit'

import {ReducersParams} from '../utils/types';

import {socketMiddleware} from './middleware';
import {wsActionsOrders, wsActionsOrdersAll} from './actions';
import {WS_URL_ORDERS_ALL, WS_URL_ORDERS} from './constants';

import rootReducer from './slices/index'

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(socketMiddleware(WS_URL_ORDERS, wsActionsOrders, false))
      .concat(socketMiddleware(WS_URL_ORDERS_ALL, wsActionsOrdersAll, true))
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReducersParams> = useSelector;

