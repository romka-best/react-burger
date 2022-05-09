import React from 'react';
import PropTypes from 'prop-types';

import {Tab} from '@ya.praktikum/react-developer-burger-ui-components';
import burgerIngredientsStyles from './BurgerIngredients.module.css';

import Ingredients from '../Ingredients/Ingredients';

const BurgerIngredients = ({onClickModal}) => {
  const [current, setCurrent] = React.useState('buns');

  return (
    <section className={`${burgerIngredientsStyles.root}`}>
      <h1 className={`${burgerIngredientsStyles.title} text text_type_main-large mt-10 mb-5`}>Соберите бургер</h1>
      <div className={burgerIngredientsStyles.tabs}>
        <Tab active={current === 'buns'} value={'buns'} onClick={() => {
          setCurrent('buns');
          document.getElementById('buns')!.scrollIntoView({
            behavior: 'smooth'
          });
        }}>
          Булки
        </Tab>
        <Tab active={current === 'sauces'} value={'sauces'} onClick={() => {
          setCurrent('sauces');
          document.getElementById('sauces')!.scrollIntoView({
            behavior: 'smooth'
          });
        }}>
          Соусы
        </Tab>
        <Tab active={current === 'main'} value={'main'} onClick={() => {
          setCurrent('main');
          document.getElementById('main')!.scrollIntoView({
            behavior: 'smooth'
          });
        }}>
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