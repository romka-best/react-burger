import React from 'react';
import PropTypes from 'prop-types';

import {useDrop} from 'react-dnd';

import {ConstructorElement, CurrencyIcon, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {IngredientParams, ReducersParams} from '../../utils/types';
import {burgerConstructorSlice} from '../../services/slices/burgerConstructor';
import {createOrder} from '../../services/slices/order';
import {useAppDispatch, useAppSelector} from '../../services/store';

import BurgerConstructorElement from '../BurgerConstructorElement/BurgerConstructorElement';

import burgerConstructorStyles from './BurgerConstructor.module.scss';

interface BurgerConstructorProps {
  onClickModal: Function
}

const BurgerConstructor = ({onClickModal}: BurgerConstructorProps) => {
  const dispatch = useAppDispatch();
  const {buns, ingredients, totalPrice} = useAppSelector(
    (state: ReducersParams) => state.burgerConstructor
  );

  const {ingredients: allIngredients} = useAppSelector(
    (state: ReducersParams) => state.ingredients
  )

  const handleClickButton = () => {
    const ingredientsIds: string[] = [buns[0]._id, buns[1]._id];
    ingredientsIds.push(...ingredients.map((ingredient) => ingredient._id));
    dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(orderDetails => {
        onClickModal('orderDetails', orderDetails);
      });
  }

  const moveBun = (bun: IngredientParams) => {
    if (buns.length > 0) {
      dispatch(burgerConstructorSlice.actions.decrementTotalPrice(buns[0].price + buns[1].price));
      dispatch(burgerConstructorSlice.actions.removeBuns());
    }
    dispatch(burgerConstructorSlice.actions.addBuns(bun));
    dispatch(burgerConstructorSlice.actions.incrementTotalPrice(bun.price + bun.price));
  }

  const moveIngredient = (ingredient: IngredientParams) => {
    dispatch(burgerConstructorSlice.actions.addIngredient(ingredient));
    dispatch(burgerConstructorSlice.actions.incrementTotalPrice(ingredient.price));
  }

  const deleteIngredient = (deletedIngredientId: string) => {
    const ingredient = ingredients.filter((ingredient) => ingredient._id === deletedIngredientId)[0];
    dispatch(burgerConstructorSlice.actions.removeIngredient(ingredient._id));
    dispatch(burgerConstructorSlice.actions.decrementTotalPrice(ingredient.price));
  }

  const moveBurgerConstructorIngredient = React.useCallback((dragIndex, hoverIndex) => {
    const dragItem = ingredients[dragIndex];
    const hoverItem = ingredients[hoverIndex];

    dispatch(burgerConstructorSlice.actions.changeSort({dragIndex, hoverIndex, dragItem, hoverItem}));
  }, [ingredients])

  const [{isHoverBun, isHoverIngredient, canDrop}, dropTarget] = useDrop({
    accept: 'NEW_INGREDIENT',
    drop(dragItem: IngredientParams) {
      const ingredient = allIngredients.filter((ingredient) => ingredient._id === dragItem._id)[0];
      const dragBuns = canDrop && ingredient && ingredient.type === 'bun';
      const dragIngredients = canDrop && ingredient && ingredient.type !== 'bun';
      if (dragBuns) {
        moveBun(ingredient);
      } else if (dragIngredients) {
        moveIngredient(ingredient);
      }
    },
    collect: (monitor) => {
      const ingredient = monitor.getItem() && allIngredients.filter((ingredient) => ingredient._id === monitor.getItem()._id)[0];
      return ({
        isHoverBun: monitor.isOver() && ingredient.type === 'bun',
        isHoverIngredient: monitor.isOver() && ingredient.type !== 'bun',
        canDrop: monitor.canDrop()
      })
    },
  });

  return (
    <section className={`${burgerConstructorStyles.root} mt-25`}>
      <div className={burgerConstructorStyles.ingredients} ref={dropTarget}>
        <div
          className={`${isHoverBun ?
            burgerConstructorStyles.dropTargetIsOverTopBun : burgerConstructorStyles.dropTarget}`}>
          {buns[0] ? (
            <div className={`${burgerConstructorStyles.constructorElement}`}>
              <ConstructorElement
                type={'top'}
                isLocked
                text={`${buns[0].name} (верх)`}
                price={buns[0].price}
                thumbnail={buns[0].image}/>
            </div>
          ) : <p className={`${burgerConstructorStyles.infoMessage} text text_type_main-medium mt-4 mb-4 ml-4`}>
            👉 Перетащите сюда булки слева, чтобы добавить в корзину 👈
          </p>}
        </div>
        <div className={`${isHoverIngredient ?
          burgerConstructorStyles.dropTargetIsOverIngredient : burgerConstructorStyles.dropTarget}`}>
          {ingredients.length > 0 ? (
            <ul className={`${burgerConstructorStyles.list} mt-3 mb-3`}>
              {ingredients.map((product, index) => {

                return (
                  <BurgerConstructorElement key={`${product._id}${index}`} product={product} index={index}
                                            deleteIngredient={deleteIngredient}
                                            moveBurgerConstructorIngredient={moveBurgerConstructorIngredient}/>
                )
              })}
            </ul>
          ) : <p className={`${burgerConstructorStyles.infoMessage} text text_type_main-medium mt-3 mb-3 ml-4`}>
            👉 Перетащите сюда ингредиенты слева, чтобы добавить в корзину 👈
          </p>
          }
        </div>
        {buns[1] && (
          <div
            className={`${isHoverBun ?
              burgerConstructorStyles.dropTargetIsOverBottomBun : burgerConstructorStyles.dropTarget}`}>
            <div className={`${burgerConstructorStyles.constructorElement}`}>
              <ConstructorElement
                type={'bottom'}
                isLocked
                text={`${buns[1].name} (низ)`}
                price={buns[1].price}
                thumbnail={buns[1].image}/>
            </div>
          </div>
        )}
      </div>
      <div className={`${burgerConstructorStyles.info} mt-10 mr-4`}>
        <div className={`${burgerConstructorStyles.priceBlock} mr-10`}>
          <p className={`${burgerConstructorStyles.price} text text_type_digits-medium mr-2`}>{totalPrice}</p>
          <div className={burgerConstructorStyles.icon}>
            <CurrencyIcon type={'primary'}/>
          </div>
        </div>
        <Button type='primary' size='medium' onClick={handleClickButton}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
}

BurgerConstructor.propTypes = {
  onClickModal: PropTypes.func.isRequired,
}

export default BurgerConstructor;