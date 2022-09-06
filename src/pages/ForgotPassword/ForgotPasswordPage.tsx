import * as React from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Input, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {THistory} from '../../utils/types';
import {isCorrectEmail} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {sendCodeForResetPassword, userSlice} from '../../services/slices/user';
import {useForm} from '../../hooks/useForm';

import forgotPasswordStyles from './ForgotPasswordPage.module.scss';

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory<THistory>();

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

  const {values, setValues} = useForm({
    email: '',
    correctEmail: false,
  });

  const navigationToSecondStep = React.useCallback(
    (event: React.SyntheticEvent): void => {
      event.preventDefault();
      if (isCorrectEmail(values.email)) {
        dispatch(userSlice.actions.setDefaultApiState());
        dispatch(sendCodeForResetPassword(values.email.toLowerCase()))
          .unwrap()
          .then((success: boolean) => {
            if (success) {
              history.replace({pathname: '/reset-password', state: {from: history.location}});
            }
          });
      }
    },
    [history, dispatch, values.email]
  );

  React.useEffect(() => {
    return (): void => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch]);

  return (
    <main className={`${forgotPasswordStyles.root}`}>
      <form className={`${forgotPasswordStyles.form}`} name={'forgot-password'} onSubmit={navigationToSecondStep}>
        <h2 className={`${forgotPasswordStyles.title} text text_type_main-medium`}>Восстановление пароля</h2>
        <Input type='email'
               placeholder='Укажите e-mail'
               value={values.email}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setValues(
                   {
                     ...values,
                     email: e.target.value,
                     correctEmail: isCorrectEmail(e.target.value)
                   }
                 );
               }
               }
               name={'email'}
               {...(values.email ? {icon: 'CloseIcon'} : {})}
               onIconClick={(): void => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setValues(
                   {
                     ...values,
                     email: '',
                     correctEmail: false
                   }
                 );
               }}
               error={userFailed}
               errorText={userFailedTextError}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <Button type='primary'
                size={type === 'mobile' ? 'small' : 'medium'}
                htmlType='submit'
                disabled={userRequest || !values.correctEmail}>
          Восстановить
        </Button>
      </form>
      <div className={`${forgotPasswordStyles.anotherVariants}`}>
        <p
          className={`${forgotPasswordStyles.anotherVariantText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'} text_color_inactive`}>
          Вспомнили пароль?
          {type === 'mobile' ? (<br/>) : null}
          <Link to={{pathname: '/login'}}
                className={`${forgotPasswordStyles.anotherVariantLink}`}>
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
