import * as React from 'react';

import {Redirect, Route} from 'react-router-dom';

import {TReducerState, TUserState} from '../../utils/types';
import {getCookie} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {updateToken, userSlice} from '../../services/slices/user';

interface IProtectedRoute {
  children: React.ReactElement,
  isNeedAuth?: boolean,
  path?: string,
  exact?: boolean
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({children, isNeedAuth = true, ...rest}: IProtectedRoute) => {
  const dispatch = useAppDispatch();
  const {isAuthenticated} = useAppSelector<TUserState>((state: TReducerState) => {
    return state.user;
  });
  const [isUserLoaded, setUserLoaded] = React.useState<boolean>(false);

  const init = async (): Promise<void> => {
    new Promise<boolean>(function (resolve: (value: (boolean | PromiseLike<boolean>)) => void, reject: (reason?: any) => void) {
      const accessToken: string | undefined = getCookie('accessToken');
      if (accessToken) {
        resolve(true);
      }
      const refreshToken: string | undefined = getCookie('refreshToken');
      if (refreshToken) {
        dispatch(updateToken())
          .unwrap()
          .then((res) => {
            if (res.success) {
              resolve(true);
            }
          })
          .catch((errorText: string) => {
            if (errorText.includes('Токен невалидный')) {
              reject(false);
            }
            dispatch(userSlice.actions.setDefaultApiState());
          });
      } else {
        reject(false);
      }
    })
      .then(() => {
        dispatch(userSlice.actions.forceLogin());
      })
      .catch(() => {
        dispatch(userSlice.actions.forceLogout());
      })
      .finally(() => {
        setUserLoaded(true);
      })
  };

  React.useEffect((): void => {
    init();
  }, []);

  if (!isUserLoaded) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={({location}) => (isAuthenticated && isNeedAuth) || (!isAuthenticated && !isNeedAuth) ? (
        children
      ) : !isAuthenticated && isNeedAuth ? (
        <Redirect
          to={{
            pathname: '/login',
            state: {from: location}
          }}
        />
      ) : isAuthenticated && !isNeedAuth ? (
        <Redirect
          to={{
            pathname: '/',
            state: {from: location}
          }}
        />) : null}
    />
  );
}

export default ProtectedRoute;
