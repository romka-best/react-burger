import React from 'react';
import PropTypes from 'prop-types';

import {CurrencyIcon, Counter} from '@ya.praktikum/react-developer-burger-ui-components';

import ingredientStyles from './Ingredient.module.css';
import {ingredientDetailsPropTypes} from '../../utils/types';

const Ingredient = ({ingredient, onClickModal}) => {
  const ingredientRef = React.useRef(null);

  const handleClickIngredient = () => {
    onClickModal(ingredientRef.current, ingredient);
  }

  const {
    name,
    price,
    image,
  } = ingredient;
  return (
    <div className={ingredientStyles.root} onClick={handleClickIngredient} ref={ingredientRef}>
      <Counter count={1} size="default" />
      <img className={`${ingredientStyles.image} ml-4 mr-4`} src={image} alt={name}/>
      <div className={`${ingredientStyles.price} mt-2 mb-2`}>
        <p className={`${ingredientStyles.priceText} text text_type_digits-default mr-2`}>{price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${ingredientStyles.name} text text_type_main-default`}>{name}</p>
    </div>
  );
}

Ingredient.propTypes = {
  ingredient: ingredientDetailsPropTypes.isRequired,
  onClickModal: PropTypes.func.isRequired,
}

export default Ingredient;
