import {Middleware, MiddlewareAPI} from 'redux';

import {getCookie} from '../../utils/functions';
import {AppDispatch, RootState} from '../../utils/types';

export const socketMiddleware = (wsUrl: string, wsActions: { [key: string]: any }, withToken: boolean): Middleware => (store: MiddlewareAPI<AppDispatch, RootState>) => {
  let socket: WebSocket | null = null;

  return (next => action => {
      const {dispatch} = store;
      const {type, payload} = action;
      const token: string | undefined | null = withToken ? getCookie('accessToken') : null;
      if (type === wsActions.connectionInit.type) {
        socket = token
          ? new WebSocket(`${wsUrl}?token=${token}`)
          : new WebSocket(`${wsUrl}`);
      }
      if (socket) {
        socket.onopen = (): void => {
          dispatch(wsActions.connectionSuccess());
        };

        socket.onerror = (): void => {
          dispatch(wsActions.connectionError());
        };

        socket.onmessage = (event: MessageEvent): void => {
          const {data} = event;
          const parsedData = JSON.parse(data);
          const {success, ...restParsedData} = parsedData;
          dispatch(wsActions.getMessage(restParsedData));
        };

        socket.onclose = (): void => {
          dispatch(wsActions.connectionClose());
        };

        if (type === wsActions.sendMessage.type && socket) {
          const message = token ? {...payload, token} : {...payload};
          socket.send(JSON.stringify(message));
        }

        if (type === wsActions.connectionClose.type && socket) {
          socket.close(1000, 'socket closed');
        }
      }

      next(action);
    }
  );
};