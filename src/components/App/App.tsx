import React from 'react';

import CustomError from '../CustomError/CustomError';
import AppHeader from '../AppHeader/AppHeader';
import Main from '../Main/Main';
import OrderDetails from '../OrderDetails/OrderDetails';
import IngredientDetails from '../IngredientDetails/IngredientDetails';
import Modal from '../Modal/Modal';

import {useAppDispatch} from '../../services/store';
import {ingredientsSlice} from '../../services/slices/indredients';

import appStyles from './App.module.css';

function App() {
  const [state, setState] = React.useState({
    currentPage: 'Конструктор',
    modalIsVisible: false,
    modalType: '',
  });

  const dispatch = useAppDispatch();

  const handleOpenModal = (modalType: 'orderDetails' | 'ingredientDetails', data: object) => {
    if (modalType === 'orderDetails') {
      setState({...state, modalIsVisible: true, modalType: 'orderDetails'});
    } else if (modalType === 'ingredientDetails') {
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
