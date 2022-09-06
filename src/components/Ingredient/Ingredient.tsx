import * as React from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {DragSourceMonitor, useDrag} from 'react-dnd';

import {CurrencyIcon, Counter, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {TIngredient, TLocation} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {modalSlice} from '../../services/slices/modal';
import {ingredientsSlice} from '../../services/slices/ingredients';
import {burgerConstructorSlice} from '../../services/slices/burgerConstructor';

import {TDragResult, TIngredientID} from './Ingredient.types';
import ingredientStyles from './Ingredient.module.scss';

interface IIngredient {
  ingredient: TIngredient,
  count: number
}

const Ingredient: React.FC<IIngredient> = ({ingredient, count = 0}: IIngredient) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation<TLocation>();

  const handleClickIngredient = (): void => {
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

  const [{ingredientStyleRoot}, ref] = useDrag<TIngredientID, unknown, TDragResult>({
    type: 'NEW_INGREDIENT',
    item: {_id},
    collect: (monitor: DragSourceMonitor<TIngredientID>): TDragResult => ({
      ingredientStyleRoot: monitor.isDragging() ? `${ingredientStyles.content} ${ingredientStyles.contentDrag}` : ingredientStyles.content,
    })
  });

  const {type: typeDevice} = useAppSelector((state) => {
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

export default Ingredient;
