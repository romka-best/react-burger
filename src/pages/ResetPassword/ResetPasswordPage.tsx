import * as React from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Input, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {THistory} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {userSlice, resetPassword} from '../../services/slices/user';
import {useForm} from '../../hooks/useForm';

import resetPasswordStyles from './ResetPasswordPage.module.scss';

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const history = useHistory<THistory>();

  const {type} = useAppSelector((state) => {
    return state.ui;
  });

  const {
    userRequest,
    userFailed,
    userFailedTextError
  } = useAppSelector((state) => {
    return state.user;
  });

  const {values, handleChange, setValues} = useForm({
    token: '',
    password: ''
  });

  const [currentTypePasswordInput, setCurrentTypePasswordInput] = React.useState<'password' | 'text'>('password');
  const onIconPasswordClick = (): void => {
    setCurrentTypePasswordInput(currentTypePasswordInput === 'password' ? 'text' : 'password');
  }

  const save = React.useCallback(
    (event: React.SyntheticEvent): void => {
      event.preventDefault();

      dispatch(
        resetPassword({
          token: values.token,
          password: values.password
        }))
        .unwrap()
        .then(success => {
          if (success) {
            dispatch(userSlice.actions.setDefaultApiState());
            history.replace({pathname: '/login'});
          }
        })
    },
    [history, values, dispatch]
  );

  React.useEffect((): () => void => {
    const state: THistory = history.location.state;
    if (!state || (state && state.from.pathname !== '/forgot-password')) {
      history.replace({pathname: '/forgot-password', state: {from: history.location}});
    }
    return () => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch, history]);

  return (
    <main className={`${resetPasswordStyles.root}`}>
      <form className={`${resetPasswordStyles.form}`} name={'reset-password'} onSubmit={save}>
        <h2 className={`${resetPasswordStyles.title} text text_type_main-medium`}>Восстановление пароля</h2>
        <Input type={currentTypePasswordInput}
               placeholder='Введите новый пароль'
               value={values.password}
               onChange={handleChange}
               icon={currentTypePasswordInput === 'password' ? 'ShowIcon' : 'HideIcon'}
               onIconClick={onIconPasswordClick}
               name={'password'}
               size={type === 'mobile' ? 'small' : 'default'}
               error={!userFailedTextError.includes('код') && userFailed}
               errorText={!userFailedTextError.includes('код') ? userFailedTextError : ''}
        />
        <Input type='text'
               placeholder='Введите код из письма'
               value={values.token}
               onChange={(e): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 handleChange(e);
               }}
               name={'token'}
               {...(values.token ? {icon: 'CloseIcon'} : {})}
               onIconClick={(): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setValues({
                   ...values,
                   token: ''
                 });
               }}
               size={type === 'mobile' ? 'small' : 'default'}
               error={userFailed}
               errorText={userFailedTextError}
        />
        <Button type='primary' size={type === 'mobile' ? 'small' : 'medium'}
                htmlType='submit' disabled={userRequest || !values.token || !values.password}>
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

