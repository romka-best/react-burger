import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner/Spinner';
import CustomError from '../CustomError/CustomError';
import BurgerIngredients from '../BurgerIngridients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';

import {BASE_URL} from '../../utils/constants';
import {IngredientsContext} from '../../services/ingredientsContext';
import {TotalPriceContext} from '../../services/totalPriceContext';
import {IngredientParams} from '../../utils/types';

import mainStyles from './Main.module.css';

const Main = ({onClickModal}) => {
  const [mainState, setMainState] = React.useState({
    isLoading: true,
    hasError: false,
    textError: '',
  });

  const [ingredientsState, setIngredientsState] = React.useState({
    ingredients: [],
    bun: {
      _id: '',
      name: '',
      type: '',
      proteins: -1,
      fat: -1,
      carbohydrates: -1,
      calories: -1,
      price: -1,
      image: '',
      image_mobile: '',
      image_large: ''
    },
    other: []
  });

  const totalPrice = {count: 0};

  const reducer = (state, action) => {
    switch (action.type) {
      case 'add':
        return {count: state.count + action.count};
      case 'remove':
        return {count: state.count - action.count};
      case 'reset':
        return totalPrice;
      default:
        throw new Error(`Wrong type of action: ${action.type}`);
    }
  }

  const dragIngredient = (type, count) => {
    totalPriceDispatch({type, count});
  }

  const [totalPriceState, totalPriceDispatch] = React.useReducer(reducer, totalPrice, undefined);

  React.useEffect(
    () => {
      const getIngredients = () => {
        setMainState({...mainState, hasError: false, isLoading: true});
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
          .then(ingredients => {
            setMainState({...mainState, isLoading: false});
            setIngredientsState({
              ...ingredientsState,
              ingredients: ingredients.data,
              // Временный хардкод
              bun: ingredients.data.filter((ingredient: IngredientParams) => {
                return ingredient.type === 'bun';
              })[0],
              other: ingredients.data.filter((ingredient: IngredientParams) => {
                return ingredient.type !== 'bun';
              })
            });

            const bunsPrice: number = ingredients.data.filter((ingredient: IngredientParams) => {
              return ingredient.type === 'bun';
            })[0].price * 2;
            const otherPrice: number = ingredients.data.filter((ingredient: IngredientParams) => {
              return ingredient.type !== 'bun';
            }).reduce((acc: number, cur: IngredientParams) => {
              return acc + cur.price
            }, 0);
            totalPriceDispatch({type: 'add', count: bunsPrice + otherPrice});
          })
          .catch(e => {
            setMainState({...mainState, hasError: true, isLoading: false, textError: e.toString()});
          });
      };
      getIngredients();
      return () => {
        totalPriceDispatch({type: 'reset'});
      }
    }, []
  );

  return (
    <main className={`${mainStyles.root}`}>
      {mainState.isLoading && !mainState.hasError && (<Spinner/>)}
      {mainState.hasError && !mainState.isLoading && (
        <CustomError textError={mainState.textError}/>
      )}
      {!mainState.isLoading && !mainState.hasError &&
      (<IngredientsContext.Provider value={ingredientsState}>
        <BurgerIngredients onClickModal={onClickModal}/>
        <TotalPriceContext.Provider value={totalPriceState}>
          <BurgerConstructor onClickModal={onClickModal}/>
        </TotalPriceContext.Provider>
      </IngredientsContext.Provider>)
      }
    </main>
  );
}

const mainPropTypes = PropTypes.shape({
  currentPage: PropTypes.string.isRequired,
});

Main.propTypes = {
  state: mainPropTypes.isRequired,
  onClickModal: PropTypes.func.isRequired,
}

export default Main;
