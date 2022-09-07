import * as React from 'react';

import CustomError from '../CustomError/CustomError';
import AppHeader from '../AppHeader/AppHeader';
import CreatedOrderDetails from '../CreatedOrderDetails/CreatedOrderDetails';
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
import FeedPage from '../../pages/Feed/FeedPage';
import ProfilePage from '../../pages/Profile/ProfilePage';
import NotFound404Page from '../../pages/NotFound404/NotFound404Page';

import {TLocation} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {uiSlice} from '../../services/slices/ui';
import {getIngredients} from '../../services/slices/ingredients';

import appStyles from './App.module.scss';


const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation<TLocation>();

  const {modalIsVisible, modalType} = useAppSelector((state) => {
    return state.modal;
  });

  const getActualModal = (): React.ReactNode => {
    switch (modalType) {
      case 'createdOrderDetails':
        return (<CreatedOrderDetails/>)
      default:
        return (<CustomError textError={'При открытии модального окна произошла ошибка 😢'}/>);
    }
  }

  React.useEffect((): () => void => {
    const handleSubscribeResize = (): void => {
      dispatch(uiSlice.actions.updateTypeDevice(document.documentElement.clientWidth));
    }

    const onSubscribeResize: Function = () => window.addEventListener('resize', handleSubscribeResize);
    const offSubscribeResize: Function = () => window.removeEventListener('resize', handleSubscribeResize);
    handleSubscribeResize();
    onSubscribeResize();

    return () => offSubscribeResize();

  }, [dispatch]);

  React.useEffect((): void => {
    dispatch(getIngredients());
  }, [dispatch]);

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
        <Route path='/feed' exact={true}>
          <FeedPage/>
        </Route>
        <Route path='/feed/:id' exact={true}>
          <OrderDetails/>
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
        <Route path='/ingredients/:id' exact={true}>
          <IngredientDetails/>
        </Route>
        <Route>
          <NotFound404Page/>
        </Route>
      </Switch>
      {
        background && (
          <Switch>
            <Route path='/ingredients/:id' exact={true}>
              <Modal>
                <IngredientDetails/>
              </Modal>
            </Route>
            <Route path='/feed/:id' exact={true}>
              <Modal>
                <OrderDetails/>
              </Modal>
            </Route>
            <Route path='/profile/orders/:id' exact={true}>
              <Modal>
                <OrderDetails/>
              </Modal>
            </Route>
          </Switch>
        )
      }
      {(modalIsVisible && modalType !== 'ingredientDetails' && modalType !== 'orderDetails') &&
      <Modal>
        {getActualModal()}
      </Modal>}
    </div>
  );
}

export default App;
