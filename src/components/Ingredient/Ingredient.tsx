import React from 'react';
import PropTypes from 'prop-types';

import {useDrag} from 'react-dnd';

import {CurrencyIcon, Counter} from '@ya.praktikum/react-developer-burger-ui-components';

import ingredientStyles from './Ingredient.module.css';
import {ingredientDetailsPropTypes} from '../../utils/types';

const Ingredient = ({ingredient, onClickModal, count = 0}) => {
  const ingredientRef = React.useRef(null);

  const handleClickIngredient = () => {
    onClickModal(ingredientRef.current, ingredient);
  }

  const {
    _id,
    type,
    name,
    price,
    image,
  } = ingredient;

  const [{opacity}, ref] = useDrag({
    type: type === 'bun' ? 'buns' : 'ingredients',
    item: {_id},
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  });

  return (
    <div className={ingredientStyles.root} onClick={handleClickIngredient} ref={ingredientRef}>
      <div className={ingredientStyles.ingredient} ref={ref} style={{opacity}}>
        <Counter count={count} size="default"/>
        <img className={`${ingredientStyles.image} ml-4 mr-4`} src={image} alt={name}/>
        <div className={`${ingredientStyles.price} mt-2 mb-2`}>
          <p className={`${ingredientStyles.priceText} text text_type_digits-default mr-2`}>{price}</p>
          <CurrencyIcon type="primary"/>
        </div>
        <p className={`${ingredientStyles.name} text text_type_main-default`}>{name}</p>
      </div>
    </div>
  );
}

Ingredient.propTypes = {
  ingredient: ingredientDetailsPropTypes.isRequired,
  onClickModal: PropTypes.func.isRequired,
}

export default Ingredient;
