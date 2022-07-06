import React from 'react';
import PropTypes from 'prop-types';

import Ingredient from '../Ingredient/Ingredient';

import {ActionParams, IngredientParams, ReducersParams} from '../../utils/types';
import {useAppSelector} from '../../services/store';

import {useInView} from '../../hooks/useInView';

import ingredientsStyles from './Ingredients.module.scss';

interface IngredientsProps {
  setCurrentTab: Function
}

const Ingredients = ({setCurrentTab}: IngredientsProps) => {
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
          return ingredient;
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
      const action = {
        type: 'add',
        value: {
          ...ingredients[i],
          count: 0
        }
      };
      switch (ingredients[i].type) {
        case 'bun': {
          bunsDispatch(action);
          break;
        }
        case 'sauce': {
          saucesDispatch(action);
          break;
        }
        case 'main': {
          mainDispatch(action);
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

  const bunsRef = React.useRef(null);
  const saucesRef = React.useRef(null);
  const mainRef = React.useRef(null);

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
        dispatch({
          type: 'update',
          value: {
            ...array[i],
            count: listIds.indexOf(array[i]._id) !== -1 ? listIds.filter((ingredientId) => ingredientId === array[i]._id).length : 0
          }
        })
      }
    }

    updateCount(burgerConstructorBunsIds, buns, bunsDispatch);
    updateCount(burgerConstructorIngredientsIds, sauces, saucesDispatch);
    updateCount(burgerConstructorIngredientsIds, main, mainDispatch);
  }, [burgerConstructorIngredients.length, burgerConstructorBuns]);

  return (
    <div className={`${ingredientsStyles.root}`}>
      <section id={'buns'} ref={bunsRef}>
        <h2 className={`${ingredientsStyles.title} text text_type_main-medium`}>Булки</h2>
        <div className={ingredientsStyles.data}>
          {
            buns.map((bun) =>
              <Ingredient count={bun.count ? bun.count : 0} key={bun._id} ingredient={bun}/>
            )
          }
        </div>
      </section>
      <section id={'sauces'} ref={saucesRef} onScroll={() => {
      }}>
        <h2 className={`${ingredientsStyles.title} text text_type_main-medium`}>Соусы</h2>
        <div className={ingredientsStyles.data}>
          {
            sauces.map((sauce) =>
              <Ingredient count={sauce.count ? sauce.count : 0} key={sauce._id} ingredient={sauce}/>
            )
          }
        </div>
      </section>
      <section id={'main'} ref={mainRef}>
        <h2 className={`${ingredientsStyles.title} text text_type_main-medium`} id={'main'}>Начинки</h2>
        <div className={ingredientsStyles.data}>
          {
            main.map((main) =>
              <Ingredient count={main.count ? main.count : 0} key={main._id} ingredient={main}/>
            )
          }
        </div>
      </section>
    </div>
  );
}

Ingredients.propTypes = {
  setCurrentTab: PropTypes.func.isRequired,
}

export default Ingredients;
