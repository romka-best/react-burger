import * as React from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Input, PasswordInput, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {TReducerState, TUIState, TUserState, AppDispatch} from '../../utils/types';
import {isCorrectEmail, isCorrectName, isCorrectPassword} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {registration, userSlice} from '../../services/slices/user';

import {TEmail, TName, TPassword} from './RegisterPageTypes';
import registerStyles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const history = useHistory<History>();

  const [nameParams, setNameParams] = React.useState<TName>({
    name: '',
    correctName: false
  });
  const [emailParams, setEmailParams] = React.useState<TEmail>({
    email: '',
    correctEmail: false,
  });
  const [passwordParams, setPasswordParams] = React.useState<TPassword>(
    {
      password: '',
      correctPassword: false,
      textError: ''
    }
  );

  const {
    userRequest,
    userFailed,
    userFailedTextError
  } = useAppSelector<TUserState>((state: TReducerState) => {
    return state.user;
  });

  const {type} = useAppSelector<TUIState>((state: TReducerState) => {
    return state.ui;
  });

  const register = React.useCallback(
    (event: React.SyntheticEvent): void => {
      event.preventDefault();

      if (!isCorrectName(nameParams.name)) {
        setNameParams({
          ...nameParams,
          correctName: false
        });
      }
      if (!isCorrectPassword(passwordParams.password)) {
        setPasswordParams({
          ...passwordParams,
          correctPassword: false
        });
      }
      if (isCorrectName(nameParams.name) && isCorrectEmail(emailParams.email) && isCorrectPassword(passwordParams.password)) {
        dispatch(registration({
          email: emailParams.email.toLowerCase(),
          password: passwordParams.password,
          name: nameParams.name
        }))
          .unwrap()
          .then((res) => {
            if (res.success) {
              dispatch(userSlice.actions.setDefaultApiState());
              history.replace({pathname: '/'});
            }
          });
      }
    },
    [dispatch, emailParams, nameParams, passwordParams, history]
  );

  React.useEffect((): () => void => {
    return (): void => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch]);

  return (
    <main className={`${registerStyles.root}`}>
      <form className={`${registerStyles.form}`} name={'register'}>
        <h2 className={`${registerStyles.title} text text_type_main-medium`}>Регистрация</h2>
        <Input type='text'
               placeholder='Имя'
               value={nameParams.name}
               onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setNameParams({
                   ...nameParams,
                   name: e.target.value,
                   correctName: isCorrectName(e.target.value)
                 });
               }}
               name={'name'}
               {...(nameParams.name ? {icon: 'CloseIcon'} : {})}
               onIconClick={(): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setNameParams({
                   ...nameParams,
                   name: '',
                   correctName: false
                 });
               }}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <Input type='email'
               placeholder='Email'
               value={emailParams.email}
               onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmailParams({
                   ...emailParams,
                   email: e.target.value,
                   correctEmail: isCorrectEmail(e.target.value),
                 });
               }}
               name={'email'}
               {...(emailParams.email ? {icon: 'CloseIcon'} : {})}
               onIconClick={(): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmailParams({
                   ...emailParams,
                   email: '',
                   correctEmail: false,
                 });
               }}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <PasswordInput
          value={passwordParams.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            dispatch(userSlice.actions.setDefaultApiState());
            setPasswordParams({
              ...passwordParams,
              password: e.target.value,
              correctPassword: isCorrectPassword(e.target.value)
            });
          }}
          name={'password'}
          size={type === 'mobile' ? 'small' : 'default'}
        />
        <div className={registerStyles.info}>
          {userFailed && (
            <p
              className={`${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>{userFailedTextError}</p>
          )}
          {
            !nameParams.correctName && (
              <ul className={`${registerStyles.listErrors}`}>
                <li
                  className={`${registerStyles.error} ${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                  Имя должно содержать:
                </li>
                <li
                  className={`${registerStyles.error} ${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                  Минимум 2 символа
                </li>
              </ul>
            )
          }
          {!passwordParams.correctPassword && (
            <ul className={`${registerStyles.listErrors}`}>
              <li
                className={`${registerStyles.error} ${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                Пароль должен содержать:
              </li>
              <li
                className={`${registerStyles.error} ${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                От 8-ми до 16-ти символов
              </li>
              <li
                className={`${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                Хотя бы одну цифру
              </li>
              <li
                className={`${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                Хотя бы одну латинскую букву в нижнем регистре
              </li>
              <li
                className={`${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                хотя бы одну латинскую букву в верхнем регистре
              </li>
            </ul>
          )}
        </div>
        <Button type='primary' size={type === 'mobile' ? 'small' : 'medium'} onClick={register}
                htmlType='submit' disabled={userRequest || !emailParams.correctEmail}>
          Зарегистрироваться
        </Button>
      </form>
      <div className={`${registerStyles.anotherVariants}`}>
        <p className={`${registerStyles.anotherVariantText}
        text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'} text_color_inactive`}>
          Уже зарегистрированы?
          {type === 'mobile' ? (<br/>) : null}
          <Link to={{pathname: '/login'}}
                className={`${registerStyles.anotherVariantLink}`}>
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
