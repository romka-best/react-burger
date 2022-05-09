import React from 'react';

import {useDispatch} from 'react-redux';

import CustomError from '../CustomError/CustomError';
import AppHeader from '../AppHeader/AppHeader';
import Main from '../Main/Main';
import OrderDetails from '../OrderDetails/OrderDetails';
import IngredientDetails from '../IngredientDetails/IngredientDetails';
import Modal from '../Modal/Modal';

import {AppDispatch} from '../../services/store';
import {ingredientsSlice} from '../../services/slices';

import burgerConstructorStyles from '../BurgerConstructor/BurgerConstructor.module.css';
import ingredientStyles from '../Ingredient/Ingredient.module.css';
import appStyles from './App.module.css';

function App() {
  const [state, setState] = React.useState({
    currentPage: 'Конструктор',
    modalIsVisible: false,
    modalType: '',
  });

  const dispatch: AppDispatch = useDispatch();

  const handleOpenModal = (ref, data) => {
    if (ref.classList.contains(burgerConstructorStyles.ingredients)) {
      setState({...state, modalIsVisible: true, modalType: 'orderDetails'});
    } else if (ref.classList.contains(ingredientStyles.root)) {
      setState({...state, modalIsVisible: true, modalType: 'ingredientDetails'});
      dispatch(ingredientsSlice.actions.putIngredientDetails(data));
    }
  }

  const getActualModal = () => {
    switch (state.modalType) {
      case 'orderDetails':
        return (<OrderDetails/>)
      case 'ingredientDetails':
        return (<IngredientDetails/>)
      default:
        return (<CustomError textError={'При открытии модального окна произошла ошибка 😢'}/>);
    }
  }

  const handleCloseModal = () => {
    setState({...state, modalIsVisible: false, modalType: ''});
  }

  return (
    <div className={appStyles.root}>
      <AppHeader currentPage={state.currentPage}/>
      <Main state={state} onClickModal={handleOpenModal}/>
      {state.modalIsVisible && <Modal onClose={handleCloseModal}>{getActualModal()}</Modal>}
    </div>
  );
}

export default App;
