import React from 'react';

import {BASE_URL} from '../../utils/constants';
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
    isLoading: true,
    hasError: false,
    textError: '',
    ingredients: [],
    modalIsVisible: false,
    modalType: '',
    modalData: {},
  });

  const handleOpenModal = (ref, data: {}) => {
    if (ref.classList.contains(burgerConstructorStyles.ingredients)) {
      setState({...state, modalIsVisible: true, modalType: 'orderDetails'});
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
        return (<OrderDetails/>)
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

  React.useEffect(
    () => {
      const getIngredients = () => {
        setState({...state, hasError: false, isLoading: true});
        fetch(`${BASE_URL}/ingredients`)
          .then(res => {
            if (res.ok) {
              return res.json();
            }
            switch (res.status) {
              case 404:
                return Promise.reject(`Мы не смогли найти то, что вы искали 🔎 Статус ошибки: ${res.status}`);
              case 500:
                return Promise.reject(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${res.status}`);
              default:
                return Promise.reject(`Произошла неизвестная ошибка. Код ошибки: ${res.status}`);
            }
          })
          .then(data => setState({...state, ingredients: data.data, isLoading: false}))
          .catch(e => {
            setState({...state, hasError: true, isLoading: false, textError: e.toString()});
          });
      };
      getIngredients();
    }, []
  );

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
