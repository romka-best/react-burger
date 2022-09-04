import * as React from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Input, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {THistory, TReducerState, TUIState, TUserState, AppDispatch} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {userSlice, resetPassword} from '../../services/slices/user';

import resetPasswordStyles from './ResetPasswordPage.module.scss';

const ForgotPasswordPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const history = useHistory<THistory>();

  const {type} = useAppSelector<TUIState>((state: TReducerState) => {
    return state.ui;
  });

  const {
    userRequest,
    userFailed,
    userFailedTextError
  } = useAppSelector<TUserState>((state: TReducerState) => {
    return state.user;
  });

  const [token, setToken] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const [currentTypePasswordInput, setCurrentTypePasswordInput] = React.useState<'password' | 'text'>('password');
  const onIconPasswordClick = (): void => {
    setCurrentTypePasswordInput(currentTypePasswordInput === 'password' ? 'text' : 'password');
  }

  const save = React.useCallback(
    (event: React.SyntheticEvent): void => {
      event.preventDefault();

      dispatch(
        resetPassword({
          token,
          password
        }))
        .unwrap()
        .then(success => {
          if (success) {
            dispatch(userSlice.actions.setDefaultApiState());
            history.replace({pathname: '/login'});
          }
        })
    },
    [history, token, password, dispatch]
  );

  React.useEffect((): () => void => {
    const state: THistory = history.location.state;
    if (!state || (state && state.from.pathname === '/forgot-password')) {
      history.replace({pathname: '/forgot-password', state: {from: history.location}});
    }
    return () => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch, history]);

  return (
    <main className={`${resetPasswordStyles.root}`}>
      <form className={`${resetPasswordStyles.form}`} name={'reset-password'}>
        <h2 className={`${resetPasswordStyles.title} text text_type_main-medium`}>Восстановление пароля</h2>
        <Input type={currentTypePasswordInput}
               placeholder='Введите новый пароль'
               value={password}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
               icon={currentTypePasswordInput === 'password' ? 'ShowIcon' : 'HideIcon'}
               onIconClick={onIconPasswordClick}
               name={'password'}
               size={type === 'mobile' ? 'small' : 'default'}
               error={!userFailedTextError.includes('код') && userFailed}
               errorText={!userFailedTextError.includes('код') ? userFailedTextError : ''}
        />
        <Input type='text'
               placeholder='Введите код из письма'
               value={token}
               onChange={(e): void=> {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setToken(e.target.value)
               }}
               name={'code'}
               {...(token ? {icon: 'CloseIcon'} : {})}
               onIconClick={(): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setToken('');
               }}
               size={type === 'mobile' ? 'small' : 'default'}
               error={userFailed}
               errorText={userFailedTextError}
        />
        <Button type='primary' size={type === 'mobile' ? 'small' : 'medium'}
                onClick={save} htmlType='submit' disabled={userRequest || !token || !password}>
          Сохранить
        </Button>
      </form>
      <div className={`${resetPasswordStyles.anotherVariants}`}>
        <p className={`${resetPasswordStyles.anotherVariantText} 
        text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'} text_color_inactive`}>
          Вспомнили пароль?
          {type === 'mobile' ? (<br/>) : null}
          <Link to={{pathname: '/login'}}
                className={`${resetPasswordStyles.anotherVariantLink}`}>
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;

