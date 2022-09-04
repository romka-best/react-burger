import * as React from 'react';
import {AnyAction, MiddlewareAPI} from 'redux';

import {getCookie} from '../../utils/functions';

export const socketMiddleware = (wsUrl: string, wsActions: any, withToken: boolean) => (store: MiddlewareAPI) => {
  let socket: WebSocket | null = null;
  let connected: boolean = false;

  return (next: (i: AnyAction) => void) => (action: AnyAction) => {
    const {dispatch}: {dispatch: React.Dispatch<AnyAction>} = store;
    const {type, payload} = action;
    const token: string | undefined | null = withToken ? getCookie('accessToken') : null;
    if (type === wsActions.connectionInit.type) {
      socket = token
        ? new WebSocket(`${wsUrl}?token=${token}`)
        : new WebSocket(`${wsUrl}`);
    }
    if (socket) {
      connected = true;
      socket.onopen = (): void => {
        dispatch(wsActions.connectionSuccess());
      };

      socket.onerror = (): void => {
        dispatch(wsActions.connectionError());
      };

      socket.onmessage = (event: MessageEvent) => {
        const {data} = event;
        const parsedData = JSON.parse(data);
        const {success, ...restParsedData} = parsedData;
        dispatch(wsActions.getMessage(restParsedData));
      };

      socket.onclose = (): void => {
        dispatch(wsActions.connectionClose());
        if (!connected) {
          setTimeout(() => {
            dispatch(wsActions.connectionInit());
          }, 1000);
        }
      };

      if (type === wsActions.sendMessage.type && socket) {
        const message = token ? {...payload, token} : {...payload};
        socket.send(JSON.stringify(message));
      }

      if (type === wsActions.connectionClose.type && socket) {
        socket.close(1000, 'socket closed');
        connected = false;
      }
    }

    next(action);
  };
};