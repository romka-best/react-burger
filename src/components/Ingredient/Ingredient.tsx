import React from 'react';
import PropTypes from 'prop-types';

import {useDrag} from 'react-dnd';

import {CurrencyIcon, Counter} from '@ya.praktikum/react-developer-burger-ui-components';

import ingredientStyles from './Ingredient.module.css';
import {ingredientDetailsPropTypes, IngredientParams} from '../../utils/types';

interface IngredientProps {
  ingredient: IngredientParams,
  onClickModal: Function,
  count: number
}

const Ingredient = ({ingredient, onClickModal, count = 0}: IngredientProps) => {
  const handleClickIngredient = () => {
    onClickModal('ingredientDetails', ingredient);
  }

  const {
    _id,
    name,
    price,
    image,
  } = ingredient;

  const [{ingredientStyleRoot}, ref] = useDrag({
    type: 'NEW_INGREDIENT',
    item: {_id},
    collect: monitor => ({
      ingredientStyleRoot: monitor.isDragging() ? `${ingredientStyles.root} ${ingredientStyles.rootDrag}` : ingredientStyles.root,
    })
  });

  return (
    <div className={ingredientStyleRoot} ref={ref} onClick={handleClickIngredient}>
      <Counter count={count} size='default'/>
      <img className={`${ingredientStyles.image} ml-4 mr-4`} src={image} alt={name}/>
      <div className={`${ingredientStyles.price} mt-2 mb-2`}>
        <p className={`${ingredientStyles.priceText} text text_type_digits-default mr-2`}>{price}</p>
        <CurrencyIcon type='primary'/>
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
