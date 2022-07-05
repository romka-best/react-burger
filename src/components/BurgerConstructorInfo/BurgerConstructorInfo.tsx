import React from 'react';

import {useHistory} from 'react-router-dom';

import {CurrencyIcon, Button, CloseIcon} from '@ya.praktikum/react-developer-burger-ui-components';
import BurgerConstructorElement from '../BurgerConstructorElement/BurgerConstructorElement';

import {ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {burgerConstructorSlice} from '../../services/slices/burgerConstructor';
import {createOrder} from '../../services/slices/order';
import {modalSlice} from '../../services/slices/modal';

import burgerConstructorInfoStyles from './BurgerConstructorInfo.module.scss';

const BurgerConstructorInfo = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const {totalPrice, ingredients, buns} = useAppSelector(
    (state: ReducersParams) => state.burgerConstructor
  );

  const {isAuthenticated} = useAppSelector(
    (state: ReducersParams) => state.user
  );

  const handleClickButton = React.useCallback(() => {
    if (!isAuthenticated) {
      history.replace({pathname: '/login'});
      return;
    }
    const ingredientsIds: string[] = [buns[0]._id, buns[1]._id];
    ingredientsIds.push(...ingredients.map((ingredient) => ingredient._id));
    dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(() => {
        dispatch(modalSlice.actions.openModal('orderDetails'));
      });
  }, [buns, dispatch, history, ingredients, isAuthenticated]);

  const deleteIngredient = (deletedIngredientId: string) => {
    const ingredient = ingredients.filter((ingredient) => ingredient._id === deletedIngredientId)[0];
    dispatch(burgerConstructorSlice.actions.removeIngredient(ingredient._id));
    dispatch(burgerConstructorSlice.actions.decrementTotalPrice(ingredient.price));
  }

  const moveBurgerConstructorIngredient = React.useCallback((dragIndex, hoverIndex) => {
    const dragItem = ingredients[dragIndex];
    const hoverItem = ingredients[hoverIndex];

    dispatch(burgerConstructorSlice.actions.changeSort({dragIndex, hoverIndex, dragItem, hoverItem}));
  }, [dispatch, ingredients]);

  const [openOrderDetails, setOpenOrderDetails] = React.useState(false);

  return (
    <>
      {openOrderDetails ? (
        <div className={burgerConstructorInfoStyles.rootExpandedMenu}>
          <div className={burgerConstructorInfoStyles.expandedMenuHeader}>
            <h2 className={`${burgerConstructorInfoStyles.expandedMenuTitle} text text_type_main-medium`}>
              Заказ
            </h2>
            <CloseIcon type={'primary'} onClick={() => {
              setOpenOrderDetails(false)
            }}/>
          </div>
          {buns[0] || buns[1] || ingredients.length > 0 ? (
            <ul className={burgerConstructorInfoStyles.list}>
              {buns[0] ? (
                <BurgerConstructorElement key={`${buns[0]._id}${0}`} product={buns[0]} index={0}
                                          deleteIngredient={deleteIngredient}
                                          moveBurgerConstructorIngredient={moveBurgerConstructorIngredient}/>
              ) : null}
              {ingredients.length > 0 ? (
                <>
                  {ingredients.map((product, index) => {
                    return (
                      <BurgerConstructorElement key={`${product._id}${index}`} product={product} index={index}
                                                deleteIngredient={deleteIngredient}
                                                moveBurgerConstructorIngredient={moveBurgerConstructorIngredient}/>
                    );
                  })}
                </>
              ) : null
              }
              {buns[1] ? (
                <BurgerConstructorElement key={`${buns[1]._id}${10000}`} product={buns[1]} index={1000}
                                          deleteIngredient={deleteIngredient}
                                          moveBurgerConstructorIngredient={moveBurgerConstructorIngredient}/>
              ) : null}
            </ul>
          ) : <p className={`${burgerConstructorInfoStyles.infoMessage} text text_type_main-medium`}>
            🛒 Пока корзина пуста 🛒
          </p>}
        </div>
      ) : null}
      <footer className={burgerConstructorInfoStyles.root}>
        <div className={burgerConstructorInfoStyles.priceBlock}>
          <p className={`${burgerConstructorInfoStyles.price} text text_type_digits-default`}>{totalPrice}</p>
          <div className={burgerConstructorInfoStyles.icon}>
            <CurrencyIcon type={'primary'}/>
          </div>
        </div>
        <Button type='primary' size='small' onClick={() => {
          if (!openOrderDetails) {
            setOpenOrderDetails(true);
          } else {
            handleClickButton();
          }
        }}>
          {openOrderDetails ? 'Заказать' : 'Смотреть заказ'}
        </Button>
      </footer>
    </>
  );
}

export default BurgerConstructorInfo;