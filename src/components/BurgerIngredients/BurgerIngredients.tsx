import React from 'react';
import PropTypes from 'prop-types';

import {Tab} from '@ya.praktikum/react-developer-burger-ui-components';
import burgerIngredientsStyles from './BurgerIngredients.module.css';

import Ingredients from '../Ingredients/Ingredients';

interface BurgerIngredientsProps {
  onClickModal: Function
}

const BurgerIngredients = ({onClickModal}: BurgerIngredientsProps) => {
  const [current, setCurrent] = React.useState('buns');

  const handleClick = (value: string) => {
    setCurrent(value);
    document.getElementById(value)!.scrollIntoView({
      behavior: 'smooth'
    });
  }

  return (
    <section className={`${burgerIngredientsStyles.root}`}>
      <h1 className={`${burgerIngredientsStyles.title} text text_type_main-large mt-10 mb-5`}>Соберите бургер</h1>
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