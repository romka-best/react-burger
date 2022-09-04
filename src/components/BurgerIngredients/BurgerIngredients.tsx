import * as React from 'react';

import Tab from '../Tab/Tab';
import Ingredients from '../Ingredients/Ingredients';

import {TReducerState, TTabName, TUIState} from '../../utils/types';
import {useAppSelector} from '../../services/store';

import burgerIngredientsStyles from './BurgerIngredients.module.scss';

const BurgerIngredients: React.FC = () => {
  const [current, setCurrent] = React.useState<TTabName>('buns');

  const handleClick = (value: TTabName) => {
    const element: HTMLElement | null = document.getElementById(value);
    if (element !== null) {
      setCurrent(value);
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const {type} = useAppSelector<TUIState>((state: TReducerState) => {
    return state.ui;
  });

  return (
    <section className={`${burgerIngredientsStyles.root}`}>
      <h1
        className={`${burgerIngredientsStyles.title} text ${type === 'desktop' || type === 'laptop' || type === 'tablet' ? 'text_type_main-large' : 'text_type_main-medium'}`}>
        Соберите бургер
      </h1>
      <div className={burgerIngredientsStyles.tabs}>
        <Tab active={current === 'buns'} value={'buns'} onClick={handleClick}>
          Булки
        </Tab>
        <Tab active={current === 'sauces'} value={'sauces'} onClick={handleClick}>
          Соусы
        </Tab>
        <Tab active={current === 'main'} value={'main'} onClick={handleClick}>
          Начинки
        </Tab>
      </div>
      <Ingredients setCurrentTab={setCurrent}/>
    </section>
  );
}

export default BurgerIngredients;