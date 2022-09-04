import {PayloadAction} from '@reduxjs/toolkit';
import {Location} from 'history';
import {store} from '../services/store';

type TIngredient = {
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
};

type TBurger = {
  bun: TIngredient,
  other: Array<TIngredient>
};

type TOrder = {
  createdAt: string;
  ingredients: Array<string>;
  name: string;
  number: number;
  status: string;
  updatedAt: string;
  _id: string;
};

type TOrders = {
  orders: Array<TOrder>;
  total: number;
  totalToday: number;
};

type TModalState = {
  modalIsVisible: boolean,
  modalType: '' | 'createdOrderDetails' | 'orderDetails' | 'ingredientDetails',
}

type TIngredientsState = {
  ingredients: Array<TIngredient>,
  currentIngredient: TIngredient,
  ingredientsRequest: boolean,
  ingredientsFailed: boolean,
  ingredientsFailedTextError: string,
}

type TBurgerConstructorState = {
  ingredients: Array<TIngredient>,
  buns: Array<TIngredient>,
  totalPrice: number,
}

type TOrderState = {
  number: number,
  name?: string,
  status?: {
    text: string,
    textColor: string
  },
  date?: string,
  ingredients?: Array<TIngredient>,
  totalPrice: number,
  orderRequest: boolean,
  orderFailed: boolean,
  orderFailedTextError: string,
}

type TUIState = {
  width: number,
  type: 'desktop' | 'laptop' | 'tablet' | 'mobile',
  breakpoints: {
    desktop?: number,
    laptop: number,
    tablet: number,
    mobile: number,
  }
}

type TUser = {
  name?: string,
  email?: string,
  password?: string
};

type TUserState = {
  isAuthenticated: boolean,
  email: string,
  name: string,
  userRequest: boolean,
  userFailed: boolean,
  userFailedTextError: string,
}

type TWSState = {
  wsConnected: boolean,
  error: PayloadAction | null;
  orders: Array<TOrder>;
  total: number | null,
  totalToday: number | null
}

type TReducerState = {
  user: TUserState,
  modal: TModalState,
  ingredients: TIngredientsState,
  burgerConstructor: TBurgerConstructorState,
  order: TOrderState,
  wsOrders: TWSState,
  wsOrdersAll: TWSState,
  ui: TUIState,
}

type TLocationState = {
  background: any;
  from: {
    pathname: string;
  };
}

type THistory = {
  from: Location
};

type TStatusOrders = {
  ready: Array<number>,
  inWork: Array<number>
}

type TTabName = 'buns' | 'sauces' | 'main';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export type {
  TIngredient,
  TUser,
  THistory,
  TStatusOrders,
  TTabName,
  TOrder,
  TOrders,
  TBurger,
  TModalState,
  TIngredientsState,
  TOrderState,
  TBurgerConstructorState,
  TUIState,
  TUserState,
  TWSState,
  TReducerState,
  TLocationState,
  RootState,
  AppDispatch,
};
