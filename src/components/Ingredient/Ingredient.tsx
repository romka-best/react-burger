import React from 'react';
import PropTypes from 'prop-types';

import {CurrencyIcon, Counter} from '@ya.praktikum/react-developer-burger-ui-components';

import ingredientStyles from './Ingredient.module.css';

const Ingredient = ({ingredient}) => {
  const {
    name,
    price,
    image,
  } = ingredient;
  return (
    <div className={ingredientStyles.root}>
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

const ingredientPropTypes = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  calories: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_mobile: PropTypes.string.isRequired,
  image_large: PropTypes.string.isRequired
});

Ingredient.propTypes = {
  ingredient: ingredientPropTypes.isRequired,
}

export default Ingredient;
