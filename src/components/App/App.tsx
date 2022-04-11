import React from 'react';

import {BASE_URL} from '../../utils/constants';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import AppHeader from '../AppHeader/AppHeader';
import Main from '../Main/Main';
import ModalOverlay from '../ModalOverlay/ModalOverlay';

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
        {state.modalIsVisible &&
        <ModalOverlay type={state.modalType} data={state.modalData}
                      onClose={handleCloseModal}/>}
      </ErrorBoundary>
    </div>
  );
}

export default App;
