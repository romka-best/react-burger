import React from 'react';
import PropTypes from 'prop-types';

import {useDrag} from 'react-dnd';

import {CurrencyIcon, Counter, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import ingredientStyles from './Ingredient.module.scss';
import {ingredientDetailsPropTypes, IngredientParams, ReducersParams} from '../../utils/types';
import {useAppSelector} from "../../services/store";

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
      ingredientStyleRoot: monitor.isDragging() ? `${ingredientStyles.content} ${ingredientStyles.contentDrag}` : ingredientStyles.content,
    })
  });

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  return (
    <div className={ingredientStyles.root}>
      <div className={ingredientStyleRoot} ref={ref} onClick={handleClickIngredient}>
        {
          type === 'desktop' || type === 'laptop' || type === 'tablet' ? (
            <Counter count={count} size='default'/>
          ) : type === 'mobile' && (
            <Counter count={count} size='small'/>
          )
        }
        <img className={ingredientStyles.image} src={image} alt={name}/>
        <div className={ingredientStyles.price}>
          <p className={`${ingredientStyles.priceText} text text_type_digits-default`}>{price}</p>
          <CurrencyIcon type='primary'/>
        </div>
        <p className={`${ingredientStyles.name} text text_type_main-default`}>{name}</p>
      </div>
      {
        type === 'mobile' && (
          <Button type='secondary' size='small'>
            Добавить
          </Button>
        )
      }
    </div>
  );
}

Ingredient.propTypes = {
  ingredient: ingredientDetailsPropTypes.isRequired,
  onClickModal: PropTypes.func.isRequired,
}

export default Ingredient;
