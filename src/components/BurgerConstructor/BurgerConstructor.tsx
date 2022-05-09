import React from 'react';
import PropTypes from 'prop-types';

import {useDrop} from 'react-dnd';

import {useSelector, useDispatch} from 'react-redux';

import {ConstructorElement, CurrencyIcon, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {ReducersParams} from '../../utils/types';
import {burgerConstructorSlice, createOrder} from '../../services/slices';
import {AppDispatch} from '../../services/store';

import BurgerConstructorElement from '../BurgerConstructorElement/BurgerConstructorElement';

import burgerConstructorStyles from './BurgerConstructor.module.css';

const BurgerConstructor = ({onClickModal}) => {
  const dispatch: AppDispatch = useDispatch();
  const {buns, ingredients, totalPrice} = useSelector(
    (state: ReducersParams) => state.burgerConstructor
  );

  const {ingredients: allIngredients} = useSelector(
    (state: ReducersParams) => state.ingredients
  )

  const handleClickButton = () => {
    const ingredientsIds: string[] = [buns[0]._id, buns[1]._id];
    ingredientsIds.push(...ingredients.map((ingredient) => ingredient._id));
    dispatch(createOrder(ingredientsIds))
      .then(orderDetails => {
        onClickModal(elementsRef.current, orderDetails.payload);
      });
  }

  const elementsRef = React.useRef(null);

  const moveBun = (item) => {
    const bun = allIngredients.filter((ingredient) => ingredient._id === item._id)[0];
    if (buns.length > 0) {
      dispatch(burgerConstructorSlice.actions.decrementTotalPrice(buns[0].price));
      dispatch(burgerConstructorSlice.actions.decrementTotalPrice(buns[1].price));
      dispatch(burgerConstructorSlice.actions.removeBuns());
    }
    dispatch(burgerConstructorSlice.actions.addBuns(bun));
    dispatch(burgerConstructorSlice.actions.incrementTotalPrice(bun.price));
    dispatch(burgerConstructorSlice.actions.incrementTotalPrice(bun.price));
  }

  const moveIngredient = (item) => {
    const ingredient = allIngredients.filter((ingredient) => ingredient._id === item._id)[0];
    dispatch(burgerConstructorSlice.actions.addIngredient(ingredient));
    dispatch(burgerConstructorSlice.actions.incrementTotalPrice(ingredient.price));
  }

  const deleteIngredient = (deletedIngredientId) => {
    const ingredient = ingredients.filter((ingredient) => ingredient._id === deletedIngredientId)[0];
    dispatch(burgerConstructorSlice.actions.removeIngredient(ingredient._id));
    dispatch(burgerConstructorSlice.actions.decrementTotalPrice(ingredient.price));
  }

  const moveBurgerConstructorIngredient = React.useCallback((dragIndex, hoverIndex) => {
    const dragItem = ingredients[dragIndex];
    const hoverItem = ingredients[hoverIndex];

    dispatch(burgerConstructorSlice.actions.changeSort({dragIndex, hoverIndex, dragItem, hoverItem}));
  }, [ingredients])

  const [{isHover: isHoverFirstBunTarget}, dropFirstBunTarget] = useDrop({
    accept: 'buns',
    drop(item) {
      moveBun(item);
    },
    collect: monitor => ({
      isHover: monitor.isOver()
    }),
  });

  const [{isHover: isHoverSecondBunTarget}, dropSecondBunTarget] = useDrop({
    accept: 'buns',
    drop(item) {
      moveBun(item);
    },
    collect: monitor => ({
      isHover: monitor.isOver()
    }),
  });

  const [{isHover: isHoverIngredientsTarget}, dropIngredientTarget] = useDrop({
    accept: 'ingredients',
    drop(item) {
      moveIngredient(item);
    },
    collect: monitor => ({
      isHover: monitor.isOver()
    })
  })

  return (
    <section className={`${burgerConstructorStyles.root} mt-25`}>
      <div className={burgerConstructorStyles.ingredients} ref={elementsRef}>
        <div ref={dropFirstBunTarget}
             className={`${isHoverFirstBunTarget || isHoverSecondBunTarget ?
               burgerConstructorStyles.dropTargetIsOver : burgerConstructorStyles.dropTarget}`}>
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
        <div className={`${isHoverIngredientsTarget ?
          burgerConstructorStyles.dropTargetIsOver : burgerConstructorStyles.dropTarget}`} ref={dropIngredientTarget}>
          {ingredients.length > 0 ? (
            <ul className={`${burgerConstructorStyles.list} mt-4 mb-4`}>
              {ingredients.map((product, index) => {

                return (
                  <BurgerConstructorElement key={`${product._id}${index}`} product={product} index={index}
                                            deleteIngredient={deleteIngredient}
                                            moveBurgerConstructorIngredient={moveBurgerConstructorIngredient}/>
                )
              })}
            </ul>
          ) : <p className={`${burgerConstructorStyles.infoMessage} text text_type_main-medium mt-4 mb-4 ml-4`}>
            👉 Перетащите сюда ингредиенты слева, чтобы добавить в корзину 👈
          </p>
          }
        </div>
        {buns[1] && (
          <div ref={dropSecondBunTarget}
               className={`${isHoverFirstBunTarget || isHoverSecondBunTarget ?
                 burgerConstructorStyles.dropTargetIsOver : burgerConstructorStyles.dropTarget}`}>
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