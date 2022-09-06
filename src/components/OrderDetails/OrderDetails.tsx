import React from 'react';
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom';

import {CurrencyIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import {
  TBurger,
  TIngredient,
  TLocation,
  TOrder
} from '../../utils/types';
import {createCardDate, getBurgerFromIngredientsIds, getStatus, getTotalCost} from '../../utils/functions';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {orderSlice, wsOrdersActions, wsOrdersAllActions} from '../../services/slices/order';

import CompositionIngredient from '../CompositionIngredient/CompositionIngredient';

import {TRouteMatch} from './OrderDetails.types';
import orderDetailsStyles from './OrderDetails.module.scss';

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const history = useHistory<History>();
  const location = useLocation<TLocation>();
  const {path} = useRouteMatch<string>();
  const {params} = useRouteMatch<TRouteMatch>();
  const background = location.state?.background;

  const order = useAppSelector(
    (state) => {
      return state.order
    }
  );

  const {
    ingredients: allIngredients
  } = useAppSelector((state) => {
    return state.ingredients;
  });

  const {orders: wsOrders, ordersAll: wsOrdersAll} = useAppSelector(
    (state) => {
      return {orders: state.wsOrders.orders, ordersAll: state.wsOrdersAll.orders}
    }
  );

  const getCompositionIngredients = (): Array<React.ReactElement> => {
    const compositionIngredients = {};
    order.ingredients?.forEach((ingredient: TIngredient) => {
      if (ingredient) {
        if (ingredient._id in compositionIngredients) {
          // @ts-ignore
          compositionIngredients[ingredient._id].count += 1;
        } else {
          // @ts-ignore
          compositionIngredients[ingredient._id] = {
            name: ingredient.name,
            price: ingredient.price,
            count: 1,
            photo: ingredient.image_mobile,
          }
        }
      }
    });

    const arrayComponents: Array<React.ReactElement> = [];

    Object.keys(compositionIngredients).forEach((compositionIngredientId: string) => {
      arrayComponents.push(
        (
          <CompositionIngredient
            // @ts-ignore
            name={compositionIngredients[compositionIngredientId].name}
            // @ts-ignore
            price={compositionIngredients[compositionIngredientId].price}
            // @ts-ignore
            count={compositionIngredients[compositionIngredientId].count}
            // @ts-ignore
            photo={compositionIngredients[compositionIngredientId].photo}
            key={compositionIngredientId}
          />
        )
      );
    });

    return arrayComponents;
  }

  React.useEffect(
    (): () => void => {
      if (order.number === -1) {
        if (path.includes('profile')) {
          dispatch(wsOrdersActions.connectionInit());
        } else {
          dispatch(wsOrdersAllActions.connectionInit());
        }
      }
      return () => {
        if (path.includes('profile')) {
          dispatch(wsOrdersActions.connectionClose());
        } else {
          dispatch(wsOrdersAllActions.connectionClose());
        }
      }
    }, [path, order.number, dispatch]
  );

  React.useEffect((): void => {
    const orders: Array<TOrder> = path.includes('profile') ? wsOrders : wsOrdersAll;
    if (order.number === -1 && (wsOrders.length > 0 || wsOrdersAll.length > 0)) {
      const order: TOrder = orders.filter((order) => {
        return order.number === Number(params.id)
      })[0];

      if (!order) {
        path.includes('profile') ?
          history.replace({pathname: '/profile/orders'})
          : history.replace({pathname: '/feed'});
        return;
      }

      const fullIngredients: TBurger = getBurgerFromIngredientsIds(allIngredients, order.ingredients, false);
      const totalPrice: number = getTotalCost(fullIngredients.bun, fullIngredients.other);
      dispatch(orderSlice.actions.putOrderDetails({
        date: order.createdAt,
        ingredients: [...fullIngredients.other, fullIngredients.bun, fullIngredients.bun],
        name: order.name,
        number: order.number,
        status: getStatus(order.status),
        totalPrice
      }));
    }
  }, [allIngredients, dispatch, history, order.number, wsOrders, wsOrdersAll, params.id, path]);

  return (
    <div className={`${orderDetailsStyles.root} ${!background ? orderDetailsStyles.root_size_big : ''}`}>
      <p className={`${orderDetailsStyles.id} text text_type_digits-default`}>#{order.number}</p>
      <div className={`${orderDetailsStyles.info}`}>
        <h2
          className={`${orderDetailsStyles.title} ${!background ? orderDetailsStyles.title_size_big : ''} text text_type_main-large`}>
          {order.name}
        </h2>
        <p
          className={`${orderDetailsStyles.status} text text_type_main-default text_color_${order.status?.textColor}`}>
          {order.status?.text}
        </p>
      </div>
      <div className={orderDetailsStyles.ingredients}>
        <h3 className={`${orderDetailsStyles.title} text text_type_main-medium`}>Состав:</h3>
        <ul className={orderDetailsStyles.listOfIngredients}>
          {getCompositionIngredients()}
        </ul>
      </div>
      <div className={orderDetailsStyles.timePriceBlock}>
        <p className={`${orderDetailsStyles.date} text text_type_main-default text_color_inactive`}>
          {createCardDate(order.date!)}
        </p>
        <div className={orderDetailsStyles.priceBlock}>
          <p className={`${orderDetailsStyles.price} text text_type_digits-default`}>{order.totalPrice}</p>
          <CurrencyIcon type={'primary'}/>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
