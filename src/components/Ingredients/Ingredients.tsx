import * as React from 'react';

import Ingredient from '../Ingredient/Ingredient';

import {TIngredient, TReducerState} from '../../utils/types';
import {useAppSelector} from '../../services/store';

import {useInView} from '../../hooks/useInView';

import {TAction} from './IngredientsTypes';
import ingredientsStyles from './Ingredients.module.scss';

interface IIngredients {
  setCurrentTab: Function
}

const Ingredients: React.FC<IIngredients> = ({setCurrentTab}: IIngredients) => {
  const ingredients = useAppSelector<Array<TIngredient>>((state: TReducerState) => {
    return state.ingredients.ingredients;
  });
  const {
    ingredients: burgerConstructorIngredients,
    buns: burgerConstructorBuns
  } = useAppSelector((state: TReducerState) => {
    return state.burgerConstructor;
  });

  const defaultArray: TIngredient[] = [];

  const ingredientReducer = (state: TIngredient[], action: TAction): TIngredient[] => {
    switch (action.type) {
      case 'add': {
        if (action.ingredient) {
          return [...state, action.ingredient];
        }
        return state;
      }
      case 'remove': {
        return state.filter((ingredient: TIngredient) => action.ingredient && ingredient._id !== action.ingredient._id);
      }
      case 'removeAll': {
        return defaultArray;
      }
      case 'update': {
        return state.map((ingredient: TIngredient) => {
          if (action.ingredient && ingredient._id === action.ingredient._id) {
            return {
              ...ingredient,
              count: action.ingredient.count ? action.ingredient.count : 0
            }
          }
          return ingredient;
        });
      }
      default:
        throw new Error(`Wrong type of action: ${action.type}`);
    }
  }

  const [buns, bunsDispatch] = React.useReducer<(state: TIngredient[], action: TAction) => TIngredient[]>(ingredientReducer, defaultArray);
  const [sauces, saucesDispatch] = React.useReducer<(state: TIngredient[], action: TAction) => TIngredient[]>(ingredientReducer, defaultArray);
  const [main, mainDispatch] = React.useReducer<(state: TIngredient[], action: TAction) => TIngredient[]>(ingredientReducer, defaultArray);

  React.useEffect((): () => void => {
    for (let i: number = 0; i < ingredients.length; i++) {
      const action = {
        type: 'add',
        ingredient: {
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

  const bunsRef: React.MutableRefObject<HTMLElement> | React.MutableRefObject<null> = React.useRef(null);
  const saucesRef: React.MutableRefObject<HTMLElement> | React.MutableRefObject<null> = React.useRef(null);
  const mainRef: React.MutableRefObject<HTMLElement> | React.MutableRefObject<null> = React.useRef(null);

  const bunsInView: boolean = useInView(bunsRef);
  const saucesInView: boolean = useInView(saucesRef);
  const mainInView: boolean = useInView(mainRef);

  React.useEffect((): void => {
    if (bunsInView) {
      setCurrentTab('buns');
    } else if (saucesInView) {
      setCurrentTab('sauces');
    } else if (mainInView) {
      setCurrentTab('main');
    }
  }, [bunsInView, saucesInView, mainInView, setCurrentTab]);

  React.useEffect(() => {
    const burgerConstructorIngredientsIds: Array<string> = burgerConstructorIngredients.map((ingredient: TIngredient) => {
      return ingredient._id;
    });
    const burgerConstructorBunsIds = burgerConstructorBuns.map((bun: TIngredient) => {
      return bun._id;
    });

    const updateCount = (listIds: string[], array: TIngredient[], dispatch: React.Dispatch<TAction>) => {
      for (let i: number = 0; i < array.length; i++) {
        dispatch({
          type: 'update',
          ingredient: {
            ...array[i],
            count: listIds.indexOf(array[i]._id) !== -1 ? listIds.filter((ingredientId: string) => ingredientId === array[i]._id).length : 0
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
            buns.map((bun: TIngredient) =>
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
            sauces.map((sauce: TIngredient) =>
              <Ingredient count={sauce.count ? sauce.count : 0} key={sauce._id} ingredient={sauce}/>
            )
          }
        </div>
      </section>
      <section id={'main'} ref={mainRef}>
        <h2 className={`${ingredientsStyles.title} text text_type_main-medium`} id={'main'}>Начинки</h2>
        <div className={ingredientsStyles.data}>
          {
            main.map((main: TIngredient) =>
              <Ingredient count={main.count ? main.count : 0} key={main._id} ingredient={main}/>
            )
          }
        </div>
      </section>
    </div>
  );
}

export default Ingredients;
