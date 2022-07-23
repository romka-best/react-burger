import React from 'react';
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom';

import {CurrencyIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import {IngredientParams, ReducersParams} from '../../utils/types';
import {createCardDate, getNormalizeIngredientsFromIds, getStatus, getTotalCost} from '../../utils/functions';
import {orderSlice} from '../../services/slices/order';
import {modalSlice} from '../../services/slices/modal';
import {useAppDispatch, useAppSelector} from '../../services/store';

import orderCardStyles from './OrderCard.module.scss';

interface OrderCardProps {
  order: {
    createdAt: string,
    updatedAt: string,
    ingredients: Array<string>,
    name: string,
    number: number,
    status: string,
    _id: string
  },
  statusIsNeed: boolean,
}

const OrderCard = ({order, statusIsNeed}: OrderCardProps) => {
  const dispatch = useAppDispatch();

  const history = useHistory();
  const {path} = useRouteMatch();
  const location = useLocation();

  const [bun, setBun] = React.useState<IngredientParams | null>(null);
  const [other, setOther] = React.useState<Array<IngredientParams>>([]);

  const {
    ingredients: allIngredients
  } = useAppSelector((state: ReducersParams) => {
    return state.ingredients;
  });

  const {type: typeDevice} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  const {createdAt, ingredients, name, number, status} = order;

  const getPhotosIngredients = React.useCallback(() => {
    const photos = []

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

  const handleClickOrder = () => {
    const {bun, other} = getNormalizeIngredientsFromIds(allIngredients, ingredients, false);
    const totalPrice = getTotalCost(bun, other);
    const fullIngredients = [...other]
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

  React.useEffect(() => {
    const {bun, other} = getNormalizeIngredientsFromIds(allIngredients, ingredients, true);
    setBun(bun);
    setOther(other);
  }, [allIngredients, ingredients])

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
