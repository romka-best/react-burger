import React from 'react';

import {IngredientParams} from '../../utils/types';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import CustomError from '../CustomError/CustomError';
import AppHeader from '../AppHeader/AppHeader';
import Main from '../Main/Main';
import OrderDetails from '../OrderDetails/OrderDetails';
import IngredientDetails from '../IngredientDetails/IngredientDetails';
import Modal from '../Modal/Modal';

import burgerConstructorStyles from '../BurgerConstructor/BurgerConstructor.module.css';
import ingredientStyles from '../Ingredient/Ingredient.module.css';
import appStyles from './App.module.css';

function App() {
  const [state, setState] = React.useState({
    currentPage: 'Конструктор',
    modalIsVisible: false,
    modalType: '',
    modalData: {},
  });

  const handleOpenModal = (ref, data: {}) => {
    if (ref.classList.contains(burgerConstructorStyles.ingredients)) {
      setState({...state, modalIsVisible: true, modalType: 'orderDetails', modalData: data});
    } else if (ref.classList.contains(ingredientStyles.root)) {
      setState({...state, modalIsVisible: true, modalType: 'ingredientDetails', modalData: data});
    }
  }

  function instanceOfIngredientParams(object: any): object is IngredientParams {
    return '_id' in object;
  }

  const getActualModal = () => {
    switch (state.modalType) {
      case 'orderDetails':
        return (<OrderDetails details={state.modalData}/>)
      case 'ingredientDetails':
        if (instanceOfIngredientParams(state.modalData)) {
          return (<IngredientDetails ingredientDetails={state.modalData}/>)
        }
        return (<CustomError textError={'Неуспешная попытка открыть подробную информацию об ингредиенте 😢'}/>);
      default:
        return (<CustomError textError={'При открытии модального окна произошла ошибка 😢'}/>);
    }
  }

  const handleCloseModal = () => {
    setState({...state, modalIsVisible: false, modalType: ''});
  }

  return (
    <div className={appStyles.root}>
      <ErrorBoundary>
        <AppHeader currentPage={state.currentPage}/>
        <Main state={state} onClickModal={handleOpenModal}/>
        {state.modalIsVisible && <Modal onClose={handleCloseModal}>{getActualModal()}</Modal>}
      </ErrorBoundary>
    </div>
  );
}

export default App;
