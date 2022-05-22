import React from 'react';
import PropTypes from 'prop-types';

import Tab from '../Tab/Tab';
import burgerIngredientsStyles from './BurgerIngredients.module.scss';

import Ingredients from '../Ingredients/Ingredients';
import {useAppSelector} from "../../services/store";
import {ReducersParams} from "../../utils/types";

interface BurgerIngredientsProps {
  onClickModal: Function
}

const BurgerIngredients = ({onClickModal}: BurgerIngredientsProps) => {
  const [current, setCurrent] = React.useState('buns');

  const handleClick = (value: string) => {
    const element = document.getElementById(value);
    if (element !== null) {
      setCurrent(value);
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  return (
    <section className={`${burgerIngredientsStyles.root}`}>
      {
        type === 'desktop' || type === 'laptop' || type === 'tablet' ? (
          <h1 className={`${burgerIngredientsStyles.title} text text_type_main-large`}>Соберите бургер</h1>
        ) : type === 'mobile' && (
          <h1 className={`${burgerIngredientsStyles.title} text text_type_main-medium`}>Соберите бургер</h1>
        )
      }
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
      <Ingredients onClickModal={onClickModal} setCurrentTab={setCurrent}/>
    </section>
  );
}

BurgerIngredients.propTypes = {
  onClickModal: PropTypes.func.isRequired,
}

export default BurgerIngredients;