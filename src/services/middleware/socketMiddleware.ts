import {AnyAction, MiddlewareAPI} from 'redux';
import {WSAction} from '../../utils/types';
import {getCookie} from '../../utils/functions';
import {wsSlice} from "../slices/ws";

export const socketMiddleware = (wsUrl: string, wsActions: WSAction, allOrders: boolean) => (store: MiddlewareAPI) => {
  let socket: WebSocket | null = null;
  let connected = false;

  return (next: (i: AnyAction) => void) => (action: AnyAction) => {
    const {dispatch} = store;
    const {type, payload} = action;
    const {wsInit, wsClose, wsSendMessage, onOpen, onClose, onError, onMessage} = wsActions;
    const token = !allOrders ? getCookie('accessToken') : null;
    if (type === wsInit) {
      socket = token
        ? new WebSocket(`${wsUrl}?token=${token}`)
        : new WebSocket(`${wsUrl}`);
    }
    if (socket) {
      connected = true;
      socket.onopen = event => {
        dispatch(wsSlice.actions.getOrders({type: onOpen, event: JSON.stringify(event)}));
      };

      socket.onerror = event => {
        dispatch(wsSlice.actions.getOrders({type: onError, event: JSON.stringify(event)}));
      };

      socket.onmessage = event => {
        const {data} = event;
        const parsedData = JSON.parse(data);
        const {success, ...restParsedData} = parsedData;
        dispatch(wsSlice.actions.getOrders({type: onMessage, data: restParsedData}));
      };

      socket.onclose = event => {
        dispatch(wsSlice.actions.getOrders({type: onClose, event: JSON.stringify(event)}));
        if (!connected) {
          setTimeout(() => {
            dispatch({type: wsInit})
          }, 1000)
        }
      };

      if (wsClose && type === wsClose && socket) {
        socket.close(1000, 'socket closed');
        connected = false;
      }


      if (wsSendMessage && type === wsSendMessage && socket) {
        const message = token ? {...payload, token} : {...payload};
        socket.send(JSON.stringify(message));
      }
    }

    next(action);
  };
};