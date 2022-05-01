import React from 'react';
import PropTypes from 'prop-types';

import Ingredient from '../Ingredient/Ingredient';
import {IngredientParams} from '../../utils/types';
import {IngredientsContext} from '../../services/ingredientsContext';

import ingredientsStyles from './Ingredients.module.css';

const Ingredients = ({onClickModal}) => {
  const data: IngredientParams[] = React.useContext(IngredientsContext).ingredients;

  const buns: IngredientParams[] = [];
  const sauces: IngredientParams[] = [];
  const main: IngredientParams[] = [];
  for (let i = 0; i < data.length; i++) {
    switch (data[i].type) {
      case 'bun':
        buns.push(data[i]);
        break;
      case 'sauce':
        sauces.push(data[i]);
        break;
      case 'main':
        main.push(data[i]);
        break;
    }
  }

  return (
    <div className={`${ingredientsStyles.root} mt-10`}>
      <h2 className={`${ingredientsStyles.title} text text_type_main-medium mb-6`}>Булки</h2>
      <div className={`${ingredientsStyles.data} ml-4`}>
        {buns.map((bun, index) => (
          <Ingredient key={bun._id} ingredient={bun} onClickModal={onClickModal}/>
        ))}
      </div>
      <h2 className={`${ingredientsStyles.title} text text_type_main-medium mt-10 mb-6`}>Соусы</h2>
      <div className={`${ingredientsStyles.data} ml-4`}>
        {sauces.map((sauce, index) => (
          <Ingredient key={sauce._id} ingredient={sauce} onClickModal={onClickModal}/>
        ))}
      </div>
      <h2 className={`${ingredientsStyles.title} text text_type_main-medium mt-10 mb-6`}>Начинки</h2>
      <div className={`${ingredientsStyles.data} ml-4`}>
        {main.map((main, index) => (
          <Ingredient key={main._id} ingredient={main} onClickModal={onClickModal}/>
        ))}
      </div>
    </div>
  );
}

Ingredients.propTypes = {
  onClickModal: PropTypes.func.isRequired,
}

export default Ingredients;
