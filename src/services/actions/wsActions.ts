import {PayloadAction} from '@reduxjs/toolkit';

import {OrderParams} from '../../utils/types';
import {
  WS_CONNECTION_START_ORDERS,
  WS_CONNECTION_SUCCESS_ORDERS,
  WS_CONNECTION_ERROR_ORDERS,
  WS_CONNECTION_CLOSE_ORDERS,
  WS_CONNECTION_CLOSED_ORDERS,
  WS_GET_MESSAGE_ORDERS,
  WS_SEND_MESSAGE_ORDERS,
  WS_CONNECTION_START_ORDERS_ALL,
  WS_CONNECTION_SUCCESS_ORDERS_ALL,
  WS_CONNECTION_ERROR_ORDERS_ALL,
  WS_CONNECTION_CLOSE_ORDERS_ALL,
  WS_CONNECTION_CLOSED_ORDERS_ALL,
  WS_GET_MESSAGE_ORDERS_ALL,
  WS_SEND_MESSAGE_ORDERS_ALL,
} from '../constants';

export const wsActionsOrders = {
  wsInit: WS_CONNECTION_START_ORDERS,
  wsClose: WS_CONNECTION_CLOSE_ORDERS,
  wsSendMessage: WS_SEND_MESSAGE_ORDERS,
  onOpen: WS_CONNECTION_SUCCESS_ORDERS,
  onClose: WS_CONNECTION_CLOSED_ORDERS,
  onError: WS_CONNECTION_ERROR_ORDERS,
  onMessage: WS_GET_MESSAGE_ORDERS
};

export const wsActionsOrdersAll = {
  wsInit: WS_CONNECTION_START_ORDERS_ALL,
  wsClose: WS_CONNECTION_CLOSE_ORDERS_ALL,
  wsSendMessage: WS_SEND_MESSAGE_ORDERS_ALL,
  onOpen: WS_CONNECTION_SUCCESS_ORDERS_ALL,
  onClose: WS_CONNECTION_CLOSED_ORDERS_ALL,
  onError: WS_CONNECTION_ERROR_ORDERS_ALL,
  onMessage: WS_GET_MESSAGE_ORDERS_ALL
}

export interface WsConnectionStartActionOrders {
  type: typeof WS_CONNECTION_START_ORDERS;
}

export interface WsConnectionCloseActionOrders {
  type: typeof WS_CONNECTION_CLOSE_ORDERS;
}

export interface WsSendMessageActionOrders {
  type: typeof WS_SEND_MESSAGE_ORDERS;
}

export interface WsConnectionSuccessActionOrders {
  type: typeof WS_CONNECTION_SUCCESS_ORDERS;
  payload: PayloadAction
}

export interface WsConnectionErrorActionOrders {
  type: typeof WS_CONNECTION_ERROR_ORDERS;
  payload: PayloadAction
}

export interface WsConnectionClosedActionOrders {
  type: typeof WS_CONNECTION_CLOSED_ORDERS;
  payload: PayloadAction
}

export interface WsGetMessageActionOrders {
  type: typeof WS_GET_MESSAGE_ORDERS;
  payload: OrderParams
}

export interface WsConnectionStartActionOrdersAll {
  type: typeof WS_CONNECTION_START_ORDERS_ALL;
}

export interface WsConnectionCloseActionOrdersAll {
  type: typeof WS_CONNECTION_CLOSE_ORDERS_ALL;
}

export interface WsSendMessageActionOrdersAll {
  type: typeof WS_SEND_MESSAGE_ORDERS_ALL;
}

export interface WsConnectionSuccessActionOrdersAll {
  type: typeof WS_CONNECTION_SUCCESS_ORDERS_ALL;
  payload: PayloadAction
}

export interface WsConnectionErrorActionOrdersAll {
  type: typeof WS_CONNECTION_ERROR_ORDERS_ALL;
  payload: PayloadAction
}

export interface WsConnectionClosedActionOrdersAll {
  type: typeof WS_CONNECTION_CLOSED_ORDERS_ALL;
  payload: PayloadAction
}

export interface WsGetMessageActionOrdersAll {
  type: typeof WS_GET_MESSAGE_ORDERS_ALL;
  payload: OrderParams
}

export type WSActionsOrders =
  | WsConnectionStartActionOrders
  | WsConnectionCloseActionOrders
  | WsSendMessageActionOrders
  | WsConnectionSuccessActionOrders
  | WsConnectionErrorActionOrders
  | WsConnectionClosedActionOrders
  | WsGetMessageActionOrders;

export type WSActionsOrdersAll =
  | WsConnectionStartActionOrdersAll
  | WsConnectionCloseActionOrdersAll
  | WsSendMessageActionOrdersAll
  | WsConnectionSuccessActionOrdersAll
  | WsConnectionErrorActionOrdersAll
  | WsConnectionClosedActionOrdersAll
  | WsGetMessageActionOrdersAll;
