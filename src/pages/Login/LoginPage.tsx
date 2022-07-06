import React, {SyntheticEvent} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';

import {PasswordInput, Button, Input} from '@ya.praktikum/react-developer-burger-ui-components';

import {LocationState, ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {userSlice, signIn} from '../../services/slices/user';

import loginStyles from './LoginPage.module.scss';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation<LocationState>();

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const {userRequest, userFailed, userFailedTextError} = useAppSelector((state: ReducersParams) => {
    return state.user;
  });

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const login = React.useCallback(
    (evt: SyntheticEvent) => {
      evt.preventDefault();
      dispatch(signIn({email, password}))
        .unwrap()
        .then((res) => {
          if (res.success) {
            dispatch(userSlice.actions.setDefaultApiState());
            const {from} = location.state || {from: {pathname: '/'}};
            history.replace({pathname: from.pathname});

          }
        });
    },
    [dispatch, email, password, location.state, history]
  );

  React.useEffect(() => {
    return () => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch]);

  return (
    <main className={`${loginStyles.root}`}>
      <form className={`${loginStyles.form}`} name={'login'}>
        <h2
          className={`${loginStyles.title} text text_type_main-medium`}>
          Вход
        </h2>
        <Input type='email'
               placeholder='E-mail'
               value={email}
               onChange={(e) => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmail(e.target.value);
               }
               }
               name={'email'}
               icon={email ? 'CloseIcon' : undefined}
               onIconClick={() => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmail('');
               }}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <PasswordInput
          value={password}
          onChange={e => {
            dispatch(userSlice.actions.setDefaultApiState());
            setPassword(e.target.value);
          }}
          name={'password'}
          size={type === 'mobile' ? 'small' : 'default'}
        />
        {userFailed && (
          <p
            className={`${loginStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>{userFailedTextError}</p>
        )}
        <Button type='primary' size={type === 'mobile' ? 'small' : 'medium'} onClick={login}>
          Войти
        </Button>
      </form>
      <div className={`${loginStyles.anotherVariants}`}>
        <p
          className={`${loginStyles.anotherVariantText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'} text_color_inactive`}>
          Вы&nbsp;— новый пользователь?
          {type === 'mobile' ? (<br/>) : null}
          <Link to={{pathname: '/register'}}
                className={`${loginStyles.anotherVariantLink}`}>
            Зарегистрироваться
          </Link>
        </p>
        <p
          className={`${loginStyles.anotherVariantText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'} text_color_inactive`}>
          Забыли пароль?
          {type === 'mobile' ? (<br/>) : null}
          <Link to={{pathname: '/forgot-password'}}
                className={`${loginStyles.anotherVariantLink}`}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
