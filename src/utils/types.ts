import {PayloadAction} from '@reduxjs/toolkit';
import PropTypes from 'prop-types';

interface IngredientParams {
  _id: string,
  name: string,
  type: string,
  proteins: number,
  fat: number,
  carbohydrates: number,
  calories: number,
  price: number,
  image: string,
  image_mobile: string,
  image_large: string,
  count?: number
}

interface OrderParams {
  createdAt: string;
  ingredients: Array<string>;
  name: string;
  number: number;
  status: string;
  updatedAt: string;
  _id: string;
}

interface OrdersParams {
  orders: Array<OrderParams>;
  total: number;
  totalToday: number;
}

interface ActionParams {
  type: string,
  value?: IngredientParams
}

interface InitialModalParams {
  modalIsVisible: boolean,
  modalType: '' | 'createdOrderDetails' | 'orderDetails' | 'ingredientDetails',
}

interface InitialIngredientsParams {
  ingredients: Array<IngredientParams>,
  currentIngredient: IngredientParams,
  ingredientsRequest: boolean,
  ingredientsFailed: boolean,
  ingredientsFailedTextError: string,
}

interface InitialBurgerConstructorParams {
  ingredients: Array<IngredientParams>,
  buns: Array<IngredientParams>,
  totalPrice: number,
}

interface InitialOrderParams {
  number: number,
  name?: string,
  status?: {
    text: string,
    textColor: string
  },
  date?: string,
  ingredients?: Array<IngredientParams>,
  totalPrice: number,
  orderRequest: boolean,
  orderFailed: boolean,
  orderFailedTextError: string,
}

interface InitialUiParams {
  width: number,
  type: 'desktop' | 'laptop' | 'tablet' | 'mobile',
  breakpoints: {
    desktop?: number,
    laptop: number,
    tablet: number,
    mobile: number,
  }
}

interface InitialUserParams {
  isAuthenticated: boolean,
  email: string,
  name: string,
  userRequest: boolean,
  userFailed: boolean,
  userFailedTextError: string,
}

interface InitialWsParams {
  wsConnected: boolean,
  error: PayloadAction | null;
  orders: Array<OrderParams>;
  total: number | null,
  totalToday: number | null
}

interface ReducersParams {
  user: InitialUserParams,
  modal: InitialModalParams,
  ingredients: InitialIngredientsParams,
  burgerConstructor: InitialBurgerConstructorParams,
  order: InitialOrderParams,
  wsOrders: InitialWsParams,
  wsOrdersAll: InitialWsParams,
  ui: InitialUiParams,
}

interface ItemParams {
  index: number
}

interface LocationState {
  background: any;
  from: {
    pathname: string;
  };
}

const ingredientDetailsPropTypes = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  calories: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_mobile: PropTypes.string.isRequired,
  image_large: PropTypes.string.isRequired
});

export type {
  IngredientParams,
  InitialModalParams,
  InitialIngredientsParams,
  InitialOrderParams,
  InitialBurgerConstructorParams,
  InitialUiParams,
  InitialUserParams,
  InitialWsParams,
  ReducersParams,
  ItemParams,
  ActionParams,
  OrderParams,
  OrdersParams,
  LocationState,
};

export {ingredientDetailsPropTypes};
