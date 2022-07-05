import React, {SyntheticEvent} from 'react';

import {Link, useHistory} from 'react-router-dom';

import {Input, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {useAppDispatch, useAppSelector} from '../../services/store';
import {sendCodeForResetPassword, userSlice} from '../../services/slices/user';

import {ReducersParams} from '../../utils/types';
import {isCorrectEmail} from '../../utils/functions';

import forgotPasswordStyles from './ForgotPasswordPage.module.scss';

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const {
    userRequest,
    userFailed,
    userFailedTextError
  } = useAppSelector((state: ReducersParams) => {
    return state.user;
  });

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const [emailParams, setEmailParams] = React.useState({
    email: '',
    correctEmail: false,
  });

  const history = useHistory();
  const navigationToSecondStep = React.useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      if (isCorrectEmail(emailParams.email)) {
        dispatch(userSlice.actions.setDefaultApiState());
        dispatch(sendCodeForResetPassword(emailParams.email.toLowerCase()))
          .unwrap()
          .then(success => {
            if (success) {
              history.replace({pathname: '/reset-password', state: {from: history.location}});
            }
          });
      }
    },
    [history, dispatch, emailParams.email]
  );

  React.useEffect(() => {
    return () => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch]);

  return (
    <main className={`${forgotPasswordStyles.root}`}>
      <form className={`${forgotPasswordStyles.form}`} name={'forgot-password'}>
        <h2 className={`${forgotPasswordStyles.title} text text_type_main-medium`}>Восстановление пароля</h2>
        <Input type='email'
               placeholder='Укажите e-mail'
               value={emailParams.email}
               onChange={(e) => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmailParams({
                   ...emailParams,
                   email: e.target.value,
                   correctEmail: isCorrectEmail(e.target.value),
                 });
               }
               }
               name={'email'}
               icon={emailParams.email ? 'CloseIcon' : undefined}
               onIconClick={() => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmailParams({
                   ...emailParams,
                   email: '',
                   correctEmail: false,
                 });
               }}
               error={userFailed}
               errorText={userFailedTextError}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <Button type='primary' size={type === 'mobile' ? 'small' : 'medium'} onClick={navigationToSecondStep}
                htmlType='submit' disabled={userRequest || !emailParams.correctEmail}>
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
