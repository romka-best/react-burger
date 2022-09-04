import * as React from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Input, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {THistory, TReducerState, TUIState, TUserState, AppDispatch} from '../../utils/types';
import {isCorrectEmail} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {sendCodeForResetPassword, userSlice} from '../../services/slices/user';

import {TEmail} from './ForgotPasswordTypes';
import forgotPasswordStyles from './ForgotPasswordPage.module.scss';

const ForgotPasswordPage: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const history = useHistory<THistory>();

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

  const [emailParams, setEmailParams] = React.useState<TEmail>({
    email: '',
    correctEmail: false,
  });

  const navigationToSecondStep = React.useCallback(
    (event: React.SyntheticEvent): void => {
      event.preventDefault();
      if (isCorrectEmail(emailParams.email)) {
        dispatch(userSlice.actions.setDefaultApiState());
        dispatch(sendCodeForResetPassword(emailParams.email.toLowerCase()))
          .unwrap()
          .then((success: boolean) => {
            if (success) {
              history.replace({pathname: '/reset-password', state: {from: history.location}});
            }
          });
      }
    },
    [history, dispatch, emailParams.email]
  );

  React.useEffect(() => {
    return (): void => {
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
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmailParams({
                   ...emailParams,
                   email: e.target.value,
                   correctEmail: isCorrectEmail(e.target.value),
                 });
               }
               }
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
               error={userFailed}
               errorText={userFailedTextError}
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <Button type='primary'
                size={type === 'mobile' ? 'small' : 'medium'}
                onClick={navigationToSecondStep}
                htmlType='submit'
                disabled={userRequest || !emailParams.correctEmail}>
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
