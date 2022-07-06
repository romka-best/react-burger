import React from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {useDrag} from 'react-dnd';

import {CurrencyIcon, Counter, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {ingredientDetailsPropTypes, IngredientParams, ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {modalSlice} from '../../services/slices/modal';
import {ingredientsSlice} from '../../services/slices/ingredients';
import {burgerConstructorSlice} from '../../services/slices/burgerConstructor';

import ingredientStyles from './Ingredient.module.scss';

interface IngredientProps {
  ingredient: IngredientParams,
  count: number
}

const Ingredient = ({ingredient, count = 0}: IngredientProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();

  const handleClickIngredient = () => {
    dispatch(ingredientsSlice.actions.putIngredientDetails(ingredient));
    history.replace({pathname: `/ingredients/${ingredient._id}`}, {background: location});
    dispatch(modalSlice.actions.openModal('ingredientDetails'));
  }

  const {
    _id,
    name,
    price,
    image,
    type
  } = ingredient;

  const [{ingredientStyleRoot}, ref] = useDrag({
    type: 'NEW_INGREDIENT',
    item: {_id},
    collect: monitor => ({
      ingredientStyleRoot: monitor.isDragging() ? `${ingredientStyles.content} ${ingredientStyles.contentDrag}` : ingredientStyles.content,
    })
  });

  const {type: typeDevice} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  return (
    <div className={ingredientStyles.root}>
      <div className={ingredientStyleRoot} ref={ref} onClick={handleClickIngredient}>
        <Counter count={count}
                 size={typeDevice === 'desktop' || typeDevice === 'laptop' || typeDevice === 'tablet' ? 'default' : 'small'}
        />
        <img className={ingredientStyles.image} src={image} alt={name}/>
        <div className={ingredientStyles.price}>
          <p className={`${ingredientStyles.priceText} text text_type_digits-default`}>{price}</p>
          <CurrencyIcon type='primary'/>
        </div>
        <p className={`${ingredientStyles.name} text text_type_main-default`}>{name}</p>
      </div>
      {
        typeDevice === 'mobile' && (
          <Button type='secondary' size='small' onClick={() => {
            if (type === 'bun') {
              dispatch(burgerConstructorSlice.actions.addBuns(ingredient))
            } else {
              dispatch(burgerConstructorSlice.actions.addIngredient(ingredient));
            }
          }}>
            Добавить
          </Button>
        )
      }
    </div>
  );
}

Ingredient.propTypes = {
  ingredient: ingredientDetailsPropTypes.isRequired,
}

export default Ingredient;
