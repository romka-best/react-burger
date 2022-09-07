import * as React from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Input, PasswordInput, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {isCorrectEmail, isCorrectName, isCorrectPassword} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {registration, userSlice} from '../../services/slices/user';
import {useForm} from '../../hooks/useForm';

import registerStyles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const history = useHistory<History>();

  const {values, setValues} = useForm({
    name: '',
    correctName: false,
    email: '',
    correctEmail: false,
    password: '',
    correctPassword: false,
  });

  const {
    userRequest,
    userFailed,
    userFailedTextError
  } = useAppSelector((state) => {
    return state.user;
  });

  const {type} = useAppSelector((state) => {
    return state.ui;
  });

  const register = React.useCallback(
    (event: React.SyntheticEvent): void => {
      event.preventDefault();

      if (!isCorrectName(values.name)) {
        setValues({
          ...values,
          correctName: false
        });
      }
      if (!isCorrectPassword(values.password)) {
        setValues({
          ...values,
          correctPassword: false
        });
      }
      if (isCorrectName(values.name) && isCorrectEmail(values.email) && isCorrectPassword(values.password)) {
        dispatch(registration({
          email: values.email.toLowerCase(),
          password: values.password,
          name: values.name
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
    [dispatch, values, history]
  );

  React.useEffect((): () => void => {
    return (): void => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch]);

  return (
    <main className={`${registerStyles.root}`}>
      <form className={`${registerStyles.form}`} name={'register'} onSubmit={register}>
        <h2 className={`${registerStyles.title} text text_type_main-medium`}>Регистрация</h2>
        <Input type='text'
               placeholder='Имя'
               value={values.name}
               onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setValues({
                   ...values,
                   name: e.target.value,
                   correctName: isCorrectName(e.target.value)
                 });
               }}
               name={'name'}
               {...(values.name ? {icon: 'CloseIcon'} : {})}
               onIconClick={(): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setValues({
                   ...values,
                   name: '',
                   correctName: false
                 });
               }}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <Input type='email'
               placeholder='Email'
               value={values.email}
               onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setValues({
                   ...values,
                   email: e.target.value,
                   correctEmail: isCorrectEmail(e.target.value),
                 });
               }}
               name={'email'}
               {...(values.email ? {icon: 'CloseIcon'} : {})}
               onIconClick={(): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setValues({
                   ...values,
                   email: '',
                   correctEmail: false,
                 });
               }}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <PasswordInput
          value={values.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            dispatch(userSlice.actions.setDefaultApiState());
            setValues({
              ...values,
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
            !values.correctName && (
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
          {!values.correctPassword && (
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
        <Button type='primary' size={type === 'mobile' ? 'small' : 'medium'}
                htmlType='submit' disabled={userRequest || !values.correctEmail}>
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
