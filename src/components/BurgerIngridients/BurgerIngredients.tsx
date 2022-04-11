import React from 'react';
import PropTypes from 'prop-types';

import {Tab} from '@ya.praktikum/react-developer-burger-ui-components';
import burgerIngredientsStyles from './BurgerIngredients.module.css';

import Ingredients from '../Ingredients/Ingredients';

const BurgerIngredients = ({ingredients, onClickModal}) => {
  const [current, setCurrent] = React.useState('buns');

  return (
    <section className={`${burgerIngredientsStyles.root}`}>
      <h1 className={`${burgerIngredientsStyles.title} text text_type_main-large mt-10 mb-5`}>Соберите бургер</h1>
      <div className={burgerIngredientsStyles.tabs}>
        <Tab active={current === 'buns'} value={'buns'} onClick={setCurrent}>
          Булки
        </Tab>
        <Tab active={current === 'sauces'} value={'sauces'} onClick={setCurrent}>
          Соусы
        </Tab>
        <Tab active={current === 'main'} value={'main'} onClick={setCurrent}>
          Начинки
        </Tab>
      </div>
      <Ingredients data={ingredients} onClickModal={onClickModal}/>
    </section>
  );
}

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickModal: PropTypes.func.isRequired,
}

export default BurgerIngredients;