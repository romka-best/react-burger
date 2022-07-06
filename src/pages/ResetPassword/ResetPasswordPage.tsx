import React, {SyntheticEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Input, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {userSlice, resetPassword} from '../../services/slices/user';

import resetPasswordStyles from './ResetPasswordPage.module.scss';

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const {
    userRequest,
    userFailed,
    userFailedTextError
  } = useAppSelector((state: ReducersParams) => {
    return state.user;
  });

  const [token, setToken] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [currentTypePasswordInput, setCurrentTypePasswordInput] = React.useState<'password' | 'text'>('password');
  const onIconPasswordClick = () => {
    setCurrentTypePasswordInput(currentTypePasswordInput === 'password' ? 'text' : 'password');
  }

  const history = useHistory();
  const save = React.useCallback(
    (event: SyntheticEvent) => {
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

  React.useEffect(() => {
    const state = history.location.state as { from: string };
    if (!state || (state && state.from === '/forgot-password')) {
      history.replace({pathname: '/forgot-password', state: {from: history.location}});
    }
    return () => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch]);

  return (
    <main className={`${resetPasswordStyles.root}`}>
      <form className={`${resetPasswordStyles.form}`} name={'reset-password'}>
        <h2 className={`${resetPasswordStyles.title} text text_type_main-medium`}>Восстановление пароля</h2>
        <Input type={currentTypePasswordInput}
               placeholder='Введите новый пароль'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
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
               onChange={(e) => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setToken(e.target.value)
               }}
               name={'code'}
               icon={token ? 'CloseIcon' : undefined}
               onIconClick={() => {
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

