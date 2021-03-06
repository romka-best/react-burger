import React, {SyntheticEvent} from 'react';
import {Link, useHistory} from 'react-router-dom';

import {Input, PasswordInput, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {ReducersParams} from '../../utils/types';
import {isCorrectEmail, isCorrectName, isCorrectPassword} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {registration, userSlice} from '../../services/slices/user';

import registerStyles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const dispatch = useAppDispatch();

  const [nameParams, setNameParams] = React.useState({
    name: '',
    correctName: false
  });
  const [emailParams, setEmailParams] = React.useState({
    email: '',
    correctEmail: false,
  });
  const [passwordParams, setPasswordParams] = React.useState(
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
  } = useAppSelector((state: ReducersParams) => {
    return state.user;
  });

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const history = useHistory();
  const register = React.useCallback(
    (event: SyntheticEvent) => {
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

  React.useEffect(() => {
    return () => {
      dispatch(userSlice.actions.setDefaultApiState());
    }
  }, [dispatch]);

  return (
    <main className={`${registerStyles.root}`}>
      <form className={`${registerStyles.form}`} name={'register'}>
        <h2 className={`${registerStyles.title} text text_type_main-medium`}>??????????????????????</h2>
        <Input type='text'
               placeholder='??????'
               value={nameParams.name}
               onChange={e => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setNameParams({
                   ...nameParams,
                   name: e.target.value,
                   correctName: isCorrectName(e.target.value)
                 });
               }}
               name={'name'}
               icon={nameParams.name ? 'CloseIcon' : undefined}
               onIconClick={() => {
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
               onChange={e => {
                 dispatch(userSlice.actions.setDefaultApiState());
                 setEmailParams({
                   ...emailParams,
                   email: e.target.value,
                   correctEmail: isCorrectEmail(e.target.value),
                 });
               }}
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
               size={type === 'mobile' ? 'small' : 'default'}
        />
        <PasswordInput
          value={passwordParams.password}
          onChange={e => {
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
                  ?????? ???????????? ??????????????????:
                </li>
                <li
                  className={`${registerStyles.error} ${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                  ?????????????? 2 ??????????????
                </li>
              </ul>
            )
          }
          {!passwordParams.correctPassword && (
            <ul className={`${registerStyles.listErrors}`}>
              <li
                className={`${registerStyles.error} ${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                ???????????? ???????????? ??????????????????:
              </li>
              <li
                className={`${registerStyles.error} ${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                ???? 8-???? ???? 16-???? ????????????????
              </li>
              <li
                className={`${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                ???????? ???? ???????? ??????????
              </li>
              <li
                className={`${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                ???????? ???? ???????? ?????????????????? ?????????? ?? ???????????? ????????????????
              </li>
              <li
                className={`${registerStyles.errorText} text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'}`}>
                ???????? ???? ???????? ?????????????????? ?????????? ?? ?????????????? ????????????????
              </li>
            </ul>
          )}
        </div>
        <Button type='primary' size={type === 'mobile' ? 'small' : 'medium'} onClick={register}
                htmlType='submit' disabled={userRequest || !emailParams.correctEmail}>
          ????????????????????????????????????
        </Button>
      </form>
      <div className={`${registerStyles.anotherVariants}`}>
        <p className={`${registerStyles.anotherVariantText}
        text ${type === 'mobile' ? 'text_type_main-small' : 'text_type_main-default'} text_color_inactive`}>
          ?????? ?????????????????????????????????
          {type === 'mobile' ? (<br/>) : null}
          <Link to={{pathname: '/login'}}
                className={`${registerStyles.anotherVariantLink}`}>
            ??????????
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
