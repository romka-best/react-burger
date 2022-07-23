import React from 'react';
import {NavLink, useRouteMatch, Switch, Route, useHistory, Redirect} from 'react-router-dom';

import {Button, Input} from '@ya.praktikum/react-developer-burger-ui-components';

import {ReducersParams} from '../../utils/types';
import {isCorrectEmail, isCorrectPassword, isCorrectName} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {WS_CONNECTION_CLOSE_ORDERS, WS_CONNECTION_START_ORDERS} from '../../services/constants';
import {getIngredients} from '../../services/slices/ingredients';
import {getUserInfo, logout, userSlice, updateUserInfo} from '../../services/slices/user';

import OrderCard from '../../components/OrderCard/OrderCard';
import Spinner from '../../components/Spinner/Spinner';

import {NameParams, LoginParams, PasswordParams} from './ProfilePageTypes';
import profileStyles from './ProfilePage.module.scss';
import OrderDetails from "../../components/OrderDetails/OrderDetails";

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  const history = useHistory();
  const {path} = useRouteMatch();

  const [nameParams, setNameParams] = React.useState<NameParams>({
    oldName: '',
    name: '',
    canChange: false,
    correctName: true
  });
  const [loginParams, setLoginParams] = React.useState<LoginParams>({
    oldLogin: '',
    login: '',
    correctLogin: true,
    canChange: false
  });
  const [passwordParams, setPasswordParams] = React.useState<PasswordParams>({
    password: '',
    canChange: false,
    correctPassword: false,
  });

  const pages = {
    isProfilePage: useRouteMatch({
      path: '/profile',
      strict: true,
      sensitive: true
    }),
    isOrdersPage: useRouteMatch({
      path: '/profile/orders',
      strict: true,
      sensitive: true
    }),
    isOrderInfoPage: useRouteMatch({
      path: '/profile/orders/:id',
      strict: true,
      sensitive: true
    })
  }

  const {
    ingredientsRequest,
    ingredientsFailed,
  } = useAppSelector((state: ReducersParams) => {
    return state.ingredients;
  });

  const {orders} = useAppSelector((state: ReducersParams) => {
    return state.ws;
  });

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const exit = () => {
    dispatch(logout())
      .unwrap()
      .then((res) => {
        if (res.success) {
          history.replace({pathname: '/login'});
        }
      });
  }

  const cancel = (event: React.SyntheticEvent) => {
    event.preventDefault();

    setLoginParams({
      ...loginParams,
      login: loginParams.oldLogin
    });
    setNameParams({
      ...nameParams,
      name: nameParams.oldName
    });
    setPasswordParams({
      ...passwordParams,
      password: ''
    });
  }

  const save = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newValues = createData();
    dispatch(updateUserInfo(newValues))
      .unwrap()
      .then((res) => {
        if (res.success) {
          if (res.user.email) {
            setLoginParams({
              ...loginParams,
              oldLogin: res.user.email,
              login: res.user.email,
              canChange: false
            });
          }
          if (res.user.name) {
            setNameParams({
              ...nameParams,
              oldName: res.user.name,
              name: res.user.name,
              canChange: false
            });
          }
          setPasswordParams({
            ...passwordParams,
            password: '',
            canChange: false,
            correctPassword: false
          });
        }
      });
  }

  const getInfo = () => {
    return dispatch(getUserInfo())
      .unwrap()
      .then((res) => {
        if (res.success) {
          setNameParams({...nameParams, name: res.user.name, oldName: res.user.name});
          setLoginParams({...loginParams, login: res.user.email, oldLogin: res.user.email});
        }
      });
  }

  const createData = () => {
    const data: { name?: string, email?: string, password?: string } = {};
    if (nameParams.oldName !== nameParams.name && isCorrectName(nameParams.name)) {
      data.name = nameParams.name;
    } else if (!isCorrectName(nameParams.name)) {
      setNameParams({
        ...nameParams,
        correctName: false
      });
    }
    if (loginParams.oldLogin !== loginParams.login && isCorrectEmail(loginParams.login)) {
      data.email = loginParams.login;
    } else if (!isCorrectEmail(loginParams.login)) {
      setLoginParams({
        ...loginParams,
        correctLogin: false
      });
    }
    if (passwordParams.password && isCorrectPassword(passwordParams.password)) {
      data.password = passwordParams.password;
    } else if (passwordParams.password) {
      setPasswordParams({
        ...passwordParams,
        correctPassword: false
      });
    }
    return data;
  }

  React.useEffect(() => {
    getInfo();
    if (pages.isOrdersPage?.isExact) {
      dispatch({type: WS_CONNECTION_START_ORDERS});
      dispatch(getIngredients());
      return () => {
        dispatch({type: WS_CONNECTION_CLOSE_ORDERS});
      }
    }
  }, [dispatch, pages.isOrdersPage?.isExact]);

  return (
    <main className={profileStyles.root}>
      {!pages.isOrderInfoPage?.isExact && (type === 'desktop' || type === 'laptop' || type === 'tablet') ? (
        <div className={profileStyles.navigation}>
          <nav>
            <ul className={profileStyles.navButtons}>
              <li className={profileStyles.navButton}>
                <NavLink
                  to={{pathname: `${path}/`}}
                  className={`${profileStyles.navButtonLink} text_color_inactive`}
                  activeClassName={`${profileStyles.navButton_selected}`}
                  exact={true}
                >
                  <p className={`${profileStyles.navButtonText} text text_type_main-medium`}>Профиль</p>
                </NavLink>
              </li>
              <li className={profileStyles.navButton}>
                <NavLink
                  to={{pathname: `${path}/orders`}}
                  className={`${profileStyles.navButtonLink} text_color_inactive`}
                  activeClassName={`${profileStyles.navButton_selected}`}
                  exact={true}
                >
                  <p className={`${profileStyles.navButtonText} text text_type_main-medium`}>История заказов</p>
                </NavLink>
              </li>
              <li className={profileStyles.navButton} onClick={exit}>
                <p className={`${profileStyles.navButtonText} text text_type_main-medium text_color_inactive`}>Выход</p>
              </li>
            </ul>
          </nav>
          {
            pages.isProfilePage?.isExact ? (
              <p className={`${profileStyles.info} text text_type_main-small text_color_inactive`}>
                В этом разделе вы можете изменить свои персональные данные
              </p>
            ) : (
              <p className={`${profileStyles.info} text text_type_main-small text_color_inactive`}>
                В этом разделе вы можете просмотреть свою историю заказов
              </p>
            )
          }
        </div>
      ) : (
        <h1 className={`${profileStyles.title} text text_type_main-medium`}>
          {pages.isProfilePage?.isExact ? 'Профиль' : !pages.isOrderInfoPage?.isExact ? 'История заказов' : null}
        </h1>
      )}
      <Switch>
        <Route path={`${path}/`} exact={true}>
          <form className={profileStyles.inputs}>
            <Input type='text'
                   placeholder='Имя'
                   value={nameParams.name}
                   onChange={(e) => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setNameParams({
                         ...nameParams,
                         name: e.target.value,
                         correctName: isCorrectName(e.target.value)
                       }
                     );
                   }
                   }
                   name={'name'}
                   disabled={!nameParams.canChange}
                   icon={'EditIcon'}
                   onIconClick={() => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setNameParams({
                       ...nameParams,
                       canChange: !nameParams.canChange
                     });
                   }
                   }
                   size={type === 'mobile' ? 'small' : 'default'}
            />
            <Input type='email'
                   placeholder='Логин'
                   value={loginParams.login}
                   onChange={(e) => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setLoginParams({
                       ...loginParams,
                       login: e.target.value,
                       correctLogin: isCorrectEmail(e.target.value),
                     });
                   }
                   }
                   name={'login'}
                   disabled={!loginParams.canChange}
                   icon={'EditIcon'}
                   onIconClick={() => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setLoginParams({
                       ...loginParams,
                       canChange: !loginParams.canChange
                     });
                   }
                   }
                   size={type === 'mobile' ? 'small' : 'default'}
            />
            <Input type={passwordParams.canChange ? 'text' : 'password'}
                   placeholder={type === 'mobile' ? 'Пароль' : 'Введите новый пароль'}
                   value={passwordParams.password}
                   onChange={(e) => setPasswordParams({
                     ...passwordParams,
                     password: e.target.value,
                     correctPassword: isCorrectPassword(e.target.value)
                   })}
                   disabled={!passwordParams.canChange}
                   icon={'EditIcon'}
                   onIconClick={() => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setPasswordParams({
                       ...passwordParams,
                       canChange: !passwordParams.canChange
                     });
                   }}
                   name={'password'}
                   size={type === 'mobile' ? 'small' : 'default'}
            />
            {(nameParams.oldName !== nameParams.name ||
              loginParams.oldLogin !== loginParams.login ||
              passwordParams.password) && (
              <div className={profileStyles.choiceButtons}>
                {
                  type === 'desktop' || type === 'laptop' || type === 'tablet' ? (
                    <>
                      <Button type='secondary' size='medium' htmlType='reset'
                              onClick={cancel}>
                        Отмена
                      </Button>
                      <Button type='primary' size='medium' htmlType='submit'
                              onClick={save}
                              disabled={!nameParams.correctName || !loginParams.correctLogin}>
                        Сохранить
                      </Button>
                    </>
                  ) : type === 'mobile' && (
                    <>
                      <Button type='primary' size='small' htmlType='submit'
                              onClick={save}
                              disabled={!nameParams.correctName || !loginParams.correctLogin}>
                        Сохранить
                      </Button>
                      <Button type='secondary' size='small' htmlType='reset'
                              onClick={cancel}>
                        Отмена
                      </Button>
                    </>
                  )
                }
              </div>
            )}
          </form>
        </Route>
        <Route path={`${path}/orders`} exact={true}>
          {ingredientsRequest && !ingredientsFailed && (<Spinner/>)}
          {!ingredientsRequest && !ingredientsFailed && (
            <ul className={profileStyles.orderList}>
              {
                orders.map((order) => {
                  return (
                    <OrderCard
                      key={order._id}
                      order={order}
                      statusIsNeed={true}
                    />
                  );
                })
              }
            </ul>
          )}
        </Route>
        <Route path={`${path}/orders/:id`} exact={true}>
          <OrderDetails/>
        </Route>
        <Route>
          <Redirect to='/'/>
        </Route>
      </Switch>
    </main>
  );
}

export default ProfilePage;
