import React from 'react';

import CustomError from '../CustomError/CustomError';
import AppHeader from '../AppHeader/AppHeader';
import OrderDetails from '../OrderDetails/OrderDetails';
import IngredientDetails from '../IngredientDetails/IngredientDetails';
import Modal from '../Modal/Modal';

import {Route, Switch, useLocation} from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import MainPage from '../../pages/Main/MainPage';
import LoginPage from '../../pages/Login/LoginPage';
import RegisterPage from '../../pages/Register/RegisterPage';
import ForgotPasswordPage from '../../pages/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from '../../pages/ResetPassword/ResetPasswordPage';
import ProfilePage from '../../pages/Profile/ProfilePage';
import NotFound404Page from '../../pages/NotFound404/NotFound404Page';

import {ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {uiSlice} from '../../services/slices/ui';

import appStyles from './App.module.scss';

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const {modalIsVisible, modalType} = useAppSelector((state: ReducersParams) => {
    return state.modal;
  });

  const getActualModal = () => {
    switch (modalType) {
      case 'orderDetails':
        return (<OrderDetails/>)
      default:
        return (<CustomError textError={'При открытии модального окна произошла ошибка 😢'}/>);
    }
  }

  React.useEffect(() => {
    const handleSubscribeResize = () => {
      dispatch(uiSlice.actions.updateTypeDevice(document.documentElement.clientWidth));
    }

    const onSubscribeResize = () => window.addEventListener('resize', handleSubscribeResize);
    const offSubscribeResize = () => window.removeEventListener('resize', handleSubscribeResize);
    handleSubscribeResize();
    onSubscribeResize();

    return () => offSubscribeResize();

  }, [dispatch]);

  // @ts-ignore
  const background = location.state?.background;

  return (
    <div className={appStyles.root}>
      <Route path='/'>
        <AppHeader/>
      </Route>
      <Switch location={background || location}>
        <Route path='/' exact={true}>
          <MainPage/>
        </Route>
        <ProtectedRoute path='/login' exact={true} isNeedAuth={false}>
          <LoginPage/>
        </ProtectedRoute>
        <ProtectedRoute path='/register' exact={true} isNeedAuth={false}>
          <RegisterPage/>
        </ProtectedRoute>
        <ProtectedRoute path='/forgot-password' exact={true} isNeedAuth={false}>
          <ForgotPasswordPage/>
        </ProtectedRoute>
        <ProtectedRoute path='/reset-password' exact={true} isNeedAuth={false}>
          <ResetPasswordPage/>
        </ProtectedRoute>
        <ProtectedRoute path='/profile'>
          <ProfilePage/>
        </ProtectedRoute>
        <Route path='/ingredients/:id'>
          <IngredientDetails/>
        </Route>
        <Route>
          <NotFound404Page/>
        </Route>
      </Switch>
      <Switch>
        {background && (
          <Route path='/ingredients/:id'>
            <Modal>
              <IngredientDetails/>
            </Modal>
          </Route>
        )}
      </Switch>
      {modalIsVisible && modalType !== 'ingredientDetails' && <Modal>{getActualModal()}</Modal>}
    </div>
  );
}

export default App;
