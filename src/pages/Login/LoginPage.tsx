import * as React from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';

import {PasswordInput, Button, Input} from '@ya.praktikum/react-developer-burger-ui-components';

import {useForm} from '../../hooks/useForm';
import {TLocation} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {userSlice, signIn} from '../../services/slices/user';

import loginStyles from './LoginPage.module.scss';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const history = useHistory<History>();
  const location = useLocation<TLocation>();

  const {type} = useAppSelector((state) => {
    return state.ui;
  });

  const {userFailed, userFailedTextError} = useAppSelector((state) => {
    return state.user;
  });

  const {values, handleChange, setValues} = useForm({
    email: '',
    password: ''
  });

  const login = React.useCallback(
    (evt: React.SyntheticEvent) => {
      evt.preventDefault();

      dispatch(signIn({email: values.email, password: values.password}))
        .unwrap()
        .then((res) => {
          if (res.success) {
            dispatch(userSlice.actions.setDefaultApiState());
            const {from} = location.state || {from: {pathname: '/'}};
            history.replace({pathname: from!.pathname});
          }
        });
    },
    [dispatch, values, location.state, history]
  );

  React.useEffect(() => {
    return (): void => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch]);

  return (
    <main className={`${loginStyles.root}`}>
      <form className={`${loginStyles.form}`} name={'login'} onSubmit={login}>
        <h2
          className={`${loginStyles.title} text text_type_main-medium`}>
          Вход
        </h2>
        <Input type='email'
               placeholder='E-mail'
               value={values.email}
               onChange={(e) => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 handleChange(e);
               }
               }
               name={'email'}
               {...(values.email ? {icon: 'CloseIcon'} : {})}
               onIconClick={() => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setValues({...values, email: ''});
               }}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <PasswordInput
          value={values.password}
          onChange={(e) => {
            dispatch(userSlice.actions.setDefaultApiState());
            handleChange(e);
          }}
          name={'password'}
          size={type === 'mobile' ? 'small' : 'default'}
        />
        {userFailed && (
          <p
            className={`${loginStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
            {userFailedTextError}
          </p>
        )}
        <Button type='primary' size={type === 'mobile' ? 'small' : 'medium'} htmlType='submit'>
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
