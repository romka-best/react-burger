import React, {useRef} from 'react';
import PropTypes from 'prop-types';

import {useInView} from '../../hooks/useInView';
import {useAppSelector} from '../../services/store';
import {ActionParams, IngredientParams, ReducersParams} from '../../utils/types';

import Ingredient from '../Ingredient/Ingredient';

import ingredientsStyles from './Ingredients.module.css';

interface IngredientsProps {
  onClickModal: Function,
  setCurrentTab: Function
}

const Ingredients = ({onClickModal, setCurrentTab}: IngredientsProps) => {
  const ingredients: IngredientParams[] = useAppSelector((state: ReducersParams) => {
    return state.ingredients.ingredients;
  });
  const {
    ingredients: burgerConstructorIngredients,
    buns: burgerConstructorBuns
  } = useAppSelector((state: ReducersParams) => {
    return state.burgerConstructor;
  });

  const defaultArray: IngredientParams[] = [];

  const ingredientReducer = (state: IngredientParams[], action: ActionParams): IngredientParams[] => {
    switch (action.type) {
      case 'add': {
        if (action.value) {
          return [...state, action.value];
        }
        return state;
      }
      case 'remove': {
        return state.filter((ingredient: IngredientParams) => action.value && ingredient._id !== action.value._id);
      }
      case 'removeAll': {
        return defaultArray;
      }
      case 'update': {
        return state.map((ingredient: IngredientParams) => {
          if (action.value && ingredient._id === action.value._id) {
            return {
              ...ingredient,
              count: action.value.count
            }
          }
          return ingredient
        })
      }
      default:
        throw new Error(`Wrong type of action: ${action.type}`);
    }
  }

  const [buns, bunsDispatch] = React.useReducer(ingredientReducer, defaultArray);
  const [sauces, saucesDispatch] = React.useReducer(ingredientReducer, defaultArray);
  const [main, mainDispatch] = React.useReducer(ingredientReducer, defaultArray);

  React.useEffect(() => {
    for (let i = 0; i < ingredients.length; i++) {
      switch (ingredients[i].type) {
        case 'bun': {
          bunsDispatch({
            type: 'add',
            value: {
              ...ingredients[i],
              count: 0
            }
          });
          break;
        }
        case 'sauce': {
          saucesDispatch({
            type: 'add',
            value: {
              ...ingredients[i],
              count: 0
            }
          });
          break;
        }
        case 'main': {
          mainDispatch({
            type: 'add',
            value: {
              ...ingredients[i],
              count: 0
            }
          });
          break;
        }
      }
    }
    return () => {
      bunsDispatch({type: 'removeAll'});
      saucesDispatch({type: 'removeAll'});
      mainDispatch({type: 'removeAll'});
    }
  }, []);

  const bunsRef = useRef(null);
  const saucesRef = useRef(null);
  const mainRef = useRef(null);

  const bunsInView = useInView(bunsRef);
  const saucesInView = useInView(saucesRef);
  const mainInView = useInView(mainRef);

  React.useEffect(() => {
    if (bunsInView) {
      setCurrentTab('buns');
    } else if (saucesInView) {
      setCurrentTab('sauces');
    } else if (mainInView) {
      setCurrentTab('main');
    }
  }, [bunsInView, saucesInView, mainInView, setCurrentTab]);

  React.useEffect(() => {
    const burgerConstructorIngredientsIds = burgerConstructorIngredients.map((ingredient) => {
      return ingredient._id;
    });
    const burgerConstructorBunsIds = burgerConstructorBuns.map((bun) => {
      return bun._id;
    });

    const updateCount = (listIds: string[], array: IngredientParams[], dispatch: React.Dispatch<ActionParams>) => {
      for (let i = 0; i < array.length; i++) {
        if (listIds.indexOf(array[i]._id) !== -1) {
          dispatch({
            type: 'update', value: {
              ...array[i],
              count: listIds.filter((ingredientId) => ingredientId === array[i]._id).length
            }
          })
        } else {
          dispatch({
            type: 'update', value: {
              ...array[i],
              count: 0
            }
          })
        }
      }
    }

    updateCount(burgerConstructorBunsIds, buns, bunsDispatch);
    updateCount(burgerConstructorIngredientsIds, sauces, saucesDispatch);
    updateCount(burgerConstructorIngredientsIds, main, mainDispatch);
  }, [burgerConstructorIngredients.length, burgerConstructorBuns.length])

  return (
    <div className={`${ingredientsStyles.root} mt-10`}>
      <section id={'buns'} ref={bunsRef}>
        <h2 className={`${ingredientsStyles.title} text text_type_main-medium mb-6`}>Булки</h2>
        <div className={`${ingredientsStyles.data} ml-4`}>
          {
            buns.map((bun) => {
              return (
                <Ingredient count={bun.count ? bun.count : 0} key={bun._id} ingredient={bun}
                            onClickModal={onClickModal}/>
              )
            })
          }
        </div>
      </section>
      <section id={'sauces'} ref={saucesRef}>
        <h2 className={`${ingredientsStyles.title} text text_type_main-medium mt-10 mb-6`}>Соусы</h2>
        <div className={`${ingredientsStyles.data} ml-4`}>
          {
            sauces.map((sauce) => (
              <Ingredient count={sauce.count ? sauce.count : 0} key={sauce._id} ingredient={sauce}
                          onClickModal={onClickModal}/>
            ))
          }
        </div>
      </section>
      <section id={'main'} ref={mainRef}>
        <h2 className={`${ingredientsStyles.title} text text_type_main-medium mt-10 mb-6`} id={'main'}>Начинки</h2>
        <div className={`${ingredientsStyles.data} ml-4`}>
          {
            main.map((main) => (
              <Ingredient count={main.count ? main.count : 0} key={main._id} ingredient={main}
                          onClickModal={onClickModal}/>
            ))
          }
        </div>
      </section>
    </div>
  );
}

Ingredients.propTypes = {
  onClickModal: PropTypes.func.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
}

export default Ingredients;
