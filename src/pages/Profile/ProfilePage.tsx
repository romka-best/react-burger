import * as React from 'react';
import {NavLink, useRouteMatch, Switch, Route, useHistory, Redirect} from 'react-router-dom';

import {Button, Input} from '@ya.praktikum/react-developer-burger-ui-components';

import {TUser} from '../../utils/types';
import {isCorrectEmail, isCorrectPassword, isCorrectName} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {wsOrdersActions} from '../../services/slices/order';
import {getUserInfo, logout, userSlice, updateUserInfo} from '../../services/slices/user';
import {useForm} from '../../hooks/useForm';

import OrderCard from '../../components/OrderCard/OrderCard';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import Spinner from '../../components/Spinner/Spinner';

import profileStyles from './ProfilePage.module.scss';

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  const history = useHistory<History>();
  const {path} = useRouteMatch<string>();

  const {values, setValues} = useForm({
    oldName: '',
    name: '',
    canChangeName: false,
    correctName: true,
    oldLogin: '',
    login: '',
    correctLogin: true,
    canChangeLogin: false,
    password: '',
    canChangePassword: false,
    correctPassword: false,
  });

  const pages = {
    isProfilePage: useRouteMatch({
      path: '/profile',
      strict: true,
      sensitive: true,
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
  } = useAppSelector((state) => {
    return state.ingredients;
  });

  const {orders} = useAppSelector((state) => {
    return state.wsOrders;
  });

  const {type} = useAppSelector((state) => {
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
  };

  const cancel = (event: React.SyntheticEvent): void => {
    event.preventDefault();

    setValues({
      ...values,
      login: values.oldLogin,
      name: values.oldName,
      password: ''
    });
  };

  const save = (event: React.SyntheticEvent): void => {
    event.preventDefault();

    const newValues: TUser = createData();
    dispatch(updateUserInfo(newValues))
      .unwrap()
      .then((res) => {
        if (res.success) {
          const updateData = {};
          if (res.user.email) {
            Object.assign(updateData, {
              oldLogin: res.user.email,
              login: res.user.email,
              canChangeLogin: false
            });
          }
          if (res.user.name) {
            Object.assign(updateData, {
              oldName: res.user.name,
              name: res.user.name,
              canChangeName: false
            });
          }
          Object.assign(updateData, {
            password: '',
            canChangePassword: false,
            correctPassword: false
          });
          setValues({
            ...values,
            ...updateData
          });
        }
      });
  }

  const getInfo = () => {
    return dispatch(getUserInfo())
      .unwrap()
      .then((res) => {
        if (res.success) {
          setValues(
            {
              ...values,
              name: res.user.name,
              oldName: res.user.name,
              login: res.user.email,
              oldLogin: res.user.email
            }
          );
        }
      });
  }

  const createData = (): TUser => {
    const data: TUser = {};
    const updateData = {};
    if (values.oldName !== values.name && isCorrectName(values.name)) {
      data.name = values.name;
    } else if (!isCorrectName(values.name)) {
      Object.assign(updateData, {
        correctName: false
      });
    }
    if (values.oldLogin !== values.login && isCorrectEmail(values.login)) {
      data.email = values.login;
    } else if (!isCorrectEmail(values.login)) {
      Object.assign(updateData, {
        correctLogin: false
      });
    }
    if (values.password && isCorrectPassword(values.password)) {
      data.password = values.password;
    } else if (values.password) {
      Object.assign(updateData, {
        correctPassword: false
      });
    }
    setValues({
      ...values,
      ...updateData
    });
    return data;
  }

  React.useEffect(() => {
    getInfo();

    if (pages.isOrdersPage?.isExact) {
      dispatch(wsOrdersActions.connectionInit());

      return () => {
        dispatch(wsOrdersActions.connectionClose());
      }
    }
    return () => {
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
          <form className={profileStyles.inputs} onSubmit={save} onReset={cancel}>
            <Input type='text'
                   placeholder='Имя'
                   value={values.name}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setValues({
                         ...values,
                         name: e.target.value,
                         correctName: isCorrectName(e.target.value)
                       }
                     );
                   }
                   }
                   name={'name'}
                   disabled={!values.canChangeName}
                   icon={'EditIcon'}
                   onIconClick={(): void => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setValues({
                       ...values,
                       canChangeName: !values.canChangeName
                     });
                   }
                   }
                   size={type === 'mobile' ? 'small' : 'default'}
            />
            <Input type='email'
                   placeholder='Логин'
                   value={values.login}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setValues({
                       ...values,
                       login: e.target.value,
                       correctLogin: isCorrectEmail(e.target.value),
                     });
                   }
                   }
                   name={'login'}
                   disabled={!values.canChangeLogin}
                   icon={'EditIcon'}
                   onIconClick={(): void => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setValues({
                       ...values,
                       canChangeLogin: !values.canChangeLogin
                     });
                   }
                   }
                   size={type === 'mobile' ? 'small' : 'default'}
            />
            <Input type={values.canChangePassword ? 'text' : 'password'}
                   placeholder={type === 'mobile' ? 'Пароль' : 'Введите новый пароль'}
                   value={values.password}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setValues({
                     ...values,
                     password: e.target.value,
                     correctPassword: isCorrectPassword(e.target.value)
                   })}
                   disabled={!values.canChangePassword}
                   icon={'EditIcon'}
                   onIconClick={(): void => {
                     dispatch(userSlice.actions.setDefaultApiState());
                     setValues({
                       ...values,
                       canChangePassword: !values.canChangePassword
                     });
                   }}
                   name={'password'}
                   size={type === 'mobile' ? 'small' : 'default'}
            />
            {(values.oldName !== values.name ||
              values.oldLogin !== values.login ||
              values.password) && (
              <div className={profileStyles.choiceButtons}>
                {
                  type === 'desktop' || type === 'laptop' || type === 'tablet' ? (
                    <>
                      <Button type='secondary' size='medium' htmlType='reset'>
                        Отмена
                      </Button>
                      <Button type='primary' size='medium' htmlType='submit'
                              disabled={!values.correctName || !values.correctLogin}>
                        Сохранить
                      </Button>
                    </>
                  ) : type === 'mobile' && (
                    <>
                      <Button type='primary' size='small' htmlType='submit'
                              disabled={!values.correctName || !values.correctLogin}>
                        Сохранить
                      </Button>
                      <Button type='secondary' size='small' htmlType='reset'>
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
