import * as React from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';

import {PasswordInput, Button, Input} from '@ya.praktikum/react-developer-burger-ui-components';

import {TLocationState, TReducerState, TUIState, TUserState, AppDispatch} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {userSlice, signIn} from '../../services/slices/user';

import loginStyles from './LoginPage.module.scss';

const LoginPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const history = useHistory<History>();
  const location = useLocation<TLocationState>();

  const {type} = useAppSelector<TUIState>((state: TReducerState) => {
    return state.ui;
  });

  const {userFailed, userFailedTextError} = useAppSelector<TUserState>((state: TReducerState) => {
    return state.user;
  });

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const login = React.useCallback(
    (evt: React.SyntheticEvent) => {
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
    return (): void => {
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
               {...(email ? {icon: 'CloseIcon'} : {})}
               onIconClick={() => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmail('');
               }}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <PasswordInput
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
