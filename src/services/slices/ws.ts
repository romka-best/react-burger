import {createSlice} from '@reduxjs/toolkit';
import {InitialWsParams} from '../../utils/types';
import {
  WS_CONNECTION_CLOSED_ORDERS,
  WS_CONNECTION_ERROR_ORDERS,
  WS_CONNECTION_SUCCESS_ORDERS,
  WS_GET_MESSAGE_ORDERS,
  WS_CONNECTION_CLOSED_ORDERS_ALL,
  WS_CONNECTION_ERROR_ORDERS_ALL,
  WS_CONNECTION_SUCCESS_ORDERS_ALL,
  WS_GET_MESSAGE_ORDERS_ALL
} from '../constants';

const initialWsState: InitialWsParams = {
  wsConnected: false,
  error: null,
  orders: [],
  total: null,
  totalToday: null
};

export const wsSlice = createSlice({
  name: 'ws',
  initialState: initialWsState,
  reducers: {
    getOrders: (state: InitialWsParams, action): InitialWsParams => {
      switch (action.payload.type) {
        case WS_CONNECTION_SUCCESS_ORDERS:
        case WS_CONNECTION_SUCCESS_ORDERS_ALL:
          return {
            ...state,
            wsConnected: true
          };
        case WS_CONNECTION_ERROR_ORDERS:
        case WS_CONNECTION_ERROR_ORDERS_ALL:
          return {
            ...state,
            error: action.payload.event,
            wsConnected: false
          };
        case WS_CONNECTION_CLOSED_ORDERS:
        case WS_CONNECTION_CLOSED_ORDERS_ALL:
          return {
            ...state,
            wsConnected: false
          };
        case WS_GET_MESSAGE_ORDERS:
          return {
            ...state,
            orders: action.payload.data.orders.reverse(),
            total: action.payload.data.total,
            totalToday: action.payload.data.totalToday
          }
        case WS_GET_MESSAGE_ORDERS_ALL:
          return {
            ...state,
            orders: action.payload.data.orders,
            total: action.payload.data.total,
            totalToday: action.payload.data.totalToday
          };
        default:
          return state;
      }
    },
  }
});

export const wsReducer = wsSlice.reducer;