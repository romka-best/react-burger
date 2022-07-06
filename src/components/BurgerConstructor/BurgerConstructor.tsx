import React from 'react';
import {useHistory} from 'react-router-dom';
import {useDrop} from 'react-dnd';

import {ConstructorElement, CurrencyIcon, Button, CloseIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import BurgerConstructorElement from '../BurgerConstructorElement/BurgerConstructorElement';

import {IngredientParams, ReducersParams} from '../../utils/types';
import {burgerConstructorSlice} from '../../services/slices/burgerConstructor';
import {createOrder} from '../../services/slices/order';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {modalSlice} from '../../services/slices/modal';

import burgerConstructorStyles from './BurgerConstructor.module.scss';

const BurgerConstructor = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [openOrderDetails, setOpenOrderDetails] = React.useState(false);
  const [canOrder, setCanOrder] = React.useState(false);

  const {buns, ingredients, totalPrice} = useAppSelector(
    (state: ReducersParams) => state.burgerConstructor
  );

  const {isAuthenticated} = useAppSelector(
    (state: ReducersParams) => state.user
  );

  const {ingredients: allIngredients} = useAppSelector(
    (state: ReducersParams) => state.ingredients
  );

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

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
    dispatch(burgerConstructorSlice.actions.removeIngredient(ingredient));
  }

  const moveBurgerConstructorIngredient = React.useCallback((dragIndex, hoverIndex) => {
    const dragItem = ingredients[dragIndex];
    const hoverItem = ingredients[hoverIndex];

    dispatch(burgerConstructorSlice.actions.changeSort({dragIndex, hoverIndex, dragItem, hoverItem}));
  }, [dispatch, ingredients]);

  const [{isHoverBun, isHoverIngredient, canDrop}, dropTarget] = useDrop({
    accept: 'NEW_INGREDIENT',
    drop(dragItem: IngredientParams) {
      const ingredient = allIngredients.filter((ingredient) => ingredient._id === dragItem._id)[0];
      const dragBuns = canDrop && ingredient && ingredient.type === 'bun';
      const dragIngredients = canDrop && ingredient && ingredient.type !== 'bun';
      if (dragBuns) {
        dispatch(burgerConstructorSlice.actions.addBuns(ingredient));
      } else if (dragIngredients) {
        dispatch(burgerConstructorSlice.actions.addIngredient(ingredient));
      }
    },
    collect: (monitor) => {
      const ingredient = monitor.getItem() && allIngredients.filter((ingredient) => ingredient._id === monitor.getItem()._id)[0];
      return ({
        isHoverBun: monitor.isOver() && ingredient.type === 'bun',
        isHoverIngredient: monitor.isOver() && ingredient.type !== 'bun',
        canDrop: monitor.canDrop()
      });
    },
  });

  React.useEffect(
    () => {
      setCanOrder(buns.length === 2 && ingredients.length > 0);
    }, [buns.length, ingredients.length]
  );

  return (
    <>
      {type === 'desktop' || type === 'laptop' || type === 'tablet' ? (
        <section className={`${burgerConstructorStyles.root}`}>
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
              ) : <p className={`${burgerConstructorStyles.infoMessage} text text_type_main-medium`}>
                👉 Перетащите сюда булки слева, чтобы добавить в корзину 👈
              </p>}
            </div>
            <div className={`${isHoverIngredient ?
              burgerConstructorStyles.dropTargetIsOverIngredient : burgerConstructorStyles.dropTarget}`}>
              {ingredients.length > 0 ? (
                <ul className={`${burgerConstructorStyles.list}`}>
                  {
                    ingredients.map((product, index) =>
                      <BurgerConstructorElement key={`${product._id}${index}`} product={product} index={index}
                                                deleteIngredient={deleteIngredient}
                                                moveBurgerConstructorIngredient={moveBurgerConstructorIngredient}/>
                    )
                  }
                </ul>
              ) : <p className={`${burgerConstructorStyles.infoMessage} text text_type_main-medium`}>
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
          <div className={`${burgerConstructorStyles.info}`}>
            <div className={`${burgerConstructorStyles.priceBlock}`}>
              <p className={`${burgerConstructorStyles.price} text text_type_digits-medium`}>{totalPrice}</p>
              <div className={burgerConstructorStyles.icon}>
                <CurrencyIcon type={'primary'}/>
              </div>
            </div>
            <Button type='primary' size='medium' disabled={!canOrder} onClick={handleClickButton}>
              Оформить заказ
            </Button>
          </div>
        </section>
      ) : type === 'mobile' && (
        <section className={burgerConstructorStyles.root_mobile}>
          {
            openOrderDetails ? (
              <div className={burgerConstructorStyles.rootExpandedMenu_mobile}>
                <div className={burgerConstructorStyles.expandedMenuHeader_mobile}>
                  <h2 className={`${burgerConstructorStyles.expandedMenuTitle_mobile} text text_type_main-medium`}>
                    Заказ
                  </h2>
                  <CloseIcon type={'primary'} onClick={() => {
                    setOpenOrderDetails(false)
                  }}/>
                </div>
                {buns[0] || buns[1] || ingredients.length > 0 ? (
                  <ul className={burgerConstructorStyles.list_mobile}>
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
                ) : (
                  <p className={`${burgerConstructorStyles.infoMessage_mobile} text text_type_main-medium`}>
                    🛒 Пока корзина пуста 🛒
                  </p>
                )
                }
              </div>
            ) : null
          }
          <footer className={burgerConstructorStyles.rootFooter_mobile}>
            <div className={burgerConstructorStyles.priceBlock_mobile}>
              <p className={`${burgerConstructorStyles.price_mobile} text text_type_digits-default`}>{totalPrice}</p>
              <div className={burgerConstructorStyles.icon_mobile}>
                <CurrencyIcon type={'primary'}/>
              </div>
            </div>
            <Button type='primary' size='small' disabled={!canOrder} onClick={() => {
              if (!openOrderDetails) {
                setOpenOrderDetails(true);
              } else {
                handleClickButton();
              }
            }}>
              {openOrderDetails ? 'Заказать' : 'Смотреть заказ'}
            </Button>
          </footer>
        </section>
      )
      }
    </>
  );
}

export default BurgerConstructor;