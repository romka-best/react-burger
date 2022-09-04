import * as React from 'react';
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom';

import {CurrencyIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import {TBurger, TIngredient, TIngredientsState, TOrder, TReducerState, AppDispatch} from '../../utils/types';
import {createCardDate, getBurgerFromIngredientsIds, getStatus, getTotalCost} from '../../utils/functions';
import {orderSlice} from '../../services/slices/order';
import {modalSlice} from '../../services/slices/modal';
import {useAppDispatch, useAppSelector} from '../../services/store';

import orderCardStyles from './OrderCard.module.scss';

interface IOrderCard {
  order: TOrder,
  statusIsNeed: boolean,
}

const OrderCard: React.FC<IOrderCard> = ({order, statusIsNeed}: IOrderCard) => {
  const dispatch: AppDispatch = useAppDispatch();

  const history = useHistory();
  const {path} = useRouteMatch();
  const location = useLocation<Location>();

  const [bun, setBun] = React.useState<TIngredient | null>(null);
  const [other, setOther] = React.useState<Array<TIngredient>>([]);

  const {
    ingredients: allIngredients
  } = useAppSelector<TIngredientsState>((state: TReducerState) => {
    return state.ingredients;
  });

  const {createdAt, ingredients, name, number, status}: TOrder = order;

  const getPhotosIngredients = React.useCallback((): Array<React.ReactNode> => {
    const photos: Array<React.ReactNode> = [];

    if (bun) {
      photos.push((
        <li className={orderCardStyles.ingredient}
            style={{zIndex: ingredients.length + 1}}
            key={bun._id}>
          <img src={bun.image_mobile}
               className={orderCardStyles.ingredient__photo}
               alt={bun.name}
          />
        </li>
      ));
    }

    other.every((currentIngredient, number) => {
      photos.push((
        <li className={orderCardStyles.ingredient}
            style={{zIndex: Math.abs(number - ingredients.length)}}
            key={currentIngredient._id}>
          {number === 4 && (
            <p className={`${orderCardStyles.ingredientsCount} text text_type_main-default`}>
              +{other.slice(4).length}
            </p>)
          }
          <img src={currentIngredient.image_mobile}
               className={`${orderCardStyles.ingredient__photo} ${number === 4 ? orderCardStyles.ingredient__photo_location_last : ''}`}
               alt={currentIngredient.name}
          />
        </li>
      ));
      return number !== 4;
    });

    return photos;
  }, [bun, ingredients.length, other]);

  const handleClickOrder = (): void => {
    const {bun, other}: TBurger = getBurgerFromIngredientsIds(allIngredients, ingredients, false);
    const totalPrice: number = getTotalCost(bun, other);
    const fullIngredients: Array<TIngredient> = [...other];
    if (bun) {
      fullIngredients.push(bun);
      fullIngredients.push(bun);
    }
    dispatch(orderSlice.actions.putOrderDetails({
      date: createdAt,
      ingredients: fullIngredients,
      name,
      number,
      status: getStatus(status),
      totalPrice
    }));
    history.replace({pathname: `${path}/${number}`}, {background: location});
    dispatch(modalSlice.actions.openModal('orderDetails'));
  }

  React.useEffect((): void => {
    const {bun, other}: TBurger = getBurgerFromIngredientsIds(allIngredients, ingredients, true);
    setBun(bun);
    setOther(other);
  }, [allIngredients, ingredients]);

  return (
    <li
      className={`${orderCardStyles.root}`}
      onClick={() => handleClickOrder()}>
      <div className={orderCardStyles.row}>
        <p className={`${orderCardStyles.id} text text_type_digits-default`}>#{number}</p>
        <p className={`${orderCardStyles.date} text text_type_main-default text_color_inactive`}>
          {createCardDate(createdAt)}
        </p>
      </div>
      <div className={`${orderCardStyles.row} ${orderCardStyles.row_vertical}`}>
        <p className={`${orderCardStyles.name} text text_type_main-medium`}>{name}</p>
        {
          statusIsNeed ? (
            <p
              className={`${orderCardStyles.status} text text_type_main-default text_color_${getStatus(status).textColor}`}>
              {getStatus(status).text}
            </p>
          ) : null
        }
      </div>
      <div className={orderCardStyles.row}>
        <ul className={orderCardStyles.ingredients}>
          {
            getPhotosIngredients()
          }
        </ul>
        <div className={orderCardStyles.priceBlock}>
          <p className={`${orderCardStyles.price} text text_type_digits-default`}>
            {
              getTotalCost(bun, other)
            }
          </p>
          <CurrencyIcon type={'primary'}/>
        </div>
      </div>
    </li>
  );
}

export default OrderCard;
