import React from 'react';
import {useHistory} from 'react-router-dom';
import {DropTargetMonitor, useDrop} from 'react-dnd';

import {ConstructorElement, CurrencyIcon, Button, CloseIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import BurgerConstructorElement from '../BurgerConstructorElement/BurgerConstructorElement';

import {
  TBurgerConstructorState,
  TIngredient,
  TIngredientsState,
  TReducerState,
  TUIState,
  TUserState,
  AppDispatch
} from '../../utils/types';
import {burgerConstructorSlice} from '../../services/slices/burgerConstructor';
import {createOrder} from '../../services/slices/order';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {modalSlice} from '../../services/slices/modal';

import {TDragResult} from './BurgerConstructorTypes';
import burgerConstructorStyles from './BurgerConstructor.module.scss';

const BurgerConstructor: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const history = useHistory<History>();

  const [openOrderDetails, setOpenOrderDetails] = React.useState<boolean>(false);
  const [canOrder, setCanOrder] = React.useState<boolean>(false);

  const {buns, ingredients, totalPrice} = useAppSelector<TBurgerConstructorState>(
    (state: TReducerState) => state.burgerConstructor
  );

  const {isAuthenticated} = useAppSelector<TUserState>(
    (state: TReducerState) => state.user
  );

  const {ingredients: allIngredients} = useAppSelector<TIngredientsState>(
    (state: TReducerState) => state.ingredients
  );

  const {type} = useAppSelector<TUIState>((state: TReducerState) => {
    return state.ui;
  });

  const handleClickButton = React.useCallback((): void => {
    if (!isAuthenticated) {
      history.replace({pathname: '/login'});
      return;
    }

    const ingredientsIds: string[] = [buns[0]._id, buns[1]._id];
    ingredientsIds.push(...ingredients.map((ingredient) => ingredient._id));
    dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(() => {
        dispatch(burgerConstructorSlice.actions.clearAll());
        dispatch(modalSlice.actions.openModal('createdOrderDetails'));
      });
  }, [buns, dispatch, history, ingredients, isAuthenticated]);

  const deleteIngredient = (deletedIngredientId: string): void => {
    const ingredient: TIngredient = ingredients.filter((ingredient) => ingredient._id === deletedIngredientId)[0];
    dispatch(burgerConstructorSlice.actions.removeIngredient(ingredient));
  }

  const moveBurgerConstructorIngredient = React.useCallback((dragIndex: number, hoverIndex: number): void => {
    const dragItem: TIngredient = ingredients[dragIndex];
    const hoverItem: TIngredient = ingredients[hoverIndex];

    dispatch(burgerConstructorSlice.actions.changeSort({dragIndex, hoverIndex, dragItem, hoverItem}));
  }, [dispatch, ingredients]);

  const [{isHoverBun, isHoverIngredient, canDrop}, dropTarget] = useDrop<TIngredient, void, TDragResult>({
    accept: 'NEW_INGREDIENT',
    drop(dragItem: TIngredient): void {
      const ingredient: TIngredient = allIngredients.filter((ingredient) => ingredient._id === dragItem._id)[0];
      const isDragBuns: boolean = canDrop && ingredient && ingredient.type === 'bun';
      const isDragIngredients: boolean = canDrop && ingredient && ingredient.type !== 'bun';
      if (isDragBuns) {
        dispatch(burgerConstructorSlice.actions.addBuns(ingredient));
      } else if (isDragIngredients) {
        dispatch(burgerConstructorSlice.actions.addIngredient(ingredient));
      }
    },
    collect: (monitor: DropTargetMonitor<TIngredient>): TDragResult => {
      const ingredient: TIngredient = monitor.getItem() && allIngredients.filter((ingredient) => ingredient._id === monitor.getItem()._id)[0];
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
              ) : (
                <p className={`${burgerConstructorStyles.infoMessage} text text_type_main-medium`}>
                  👉 Перетащите сюда ингредиенты слева, чтобы добавить в корзину 👈
                </p>
              )
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
                <div className={burgerConstructorStyles.expandedMenu__header_mobile}>
                  <h2 className={`${burgerConstructorStyles.expandedMenu__title_mobile} text text_type_main-medium`}>
                    Заказ
                  </h2>
                  <CloseIcon type={'primary'} onClick={(): void => {
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
                        {ingredients.map((product: TIngredient, index: number) => {
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
            <Button type='primary' size='small' disabled={!canOrder} onClick={(): void => {
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