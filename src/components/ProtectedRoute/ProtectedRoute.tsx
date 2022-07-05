import React from 'react';

import {Redirect, Route} from 'react-router-dom';

import {ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {updateToken, userSlice} from '../../services/slices/user';

import {getCookie} from '../../utils/functions';


interface ProtectedRouteProps {
  children: React.ReactElement,
  isNeedAuth?: boolean,
  path?: string,
  exact?: boolean
}

export default function ProtectedRoute({children, isNeedAuth = true, ...rest}: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const {isAuthenticated} = useAppSelector((state: ReducersParams) => {
    return state.user;
  });
  const [isUserLoaded, setUserLoaded] = React.useState(false);

  const init = async () => {
    new Promise<boolean>(function (resolve, reject) {
      const accessToken = getCookie('accessToken');
      if (accessToken) {
        resolve(true);
      }
      const refreshToken = getCookie('refreshToken');
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

  React.useEffect(() => {
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
