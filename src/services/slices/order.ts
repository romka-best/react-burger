import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

import DataService from '../dataService';
import {TIngredient, TOrder, TOrderState, TWSState} from '../../utils/types';

const initialOrderState: TOrderState = {
  number: -1,
  name: '',
  status: {
    text: '',
    textColor: ''
  },
  date: '',
  ingredients: [],
  totalPrice: 0,
  orderRequest: false,
  orderFailed: false,
  orderFailedTextError: '',
};

const initialWsOrdersAllState: TWSState = {
  wsConnected: false,
  error: null,
  orders: [],
  total: null,
  totalToday: null,
};

const initialWsOrdersState: TWSState = {
  wsConnected: false,
  error: null,
  orders: [],
  total: null,
  totalToday: null,
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[], thunkApi) => {
    try {
      const res = await DataService.createOrder(ingredients);
      return res.data.order.number as number;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 404:
            return thunkApi.rejectWithValue(`Мы не смогли найти то, что вы искали 🔎 Статус ошибки: ${error.response.status}`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

export const wsOrdersAllSlice = createSlice({
  name: 'wsOrdersAll',
  initialState: initialWsOrdersAllState,
  reducers: {
    connectionInit: (state) => {
      return state;
    },
    connectionClose: (state) => {
      return state;
    },
    sendMessage: (state) => {
      return state;
    },
    connectionSuccess: (state) => {
      return {
        ...state,
        wsConnected: true
      };
    },
    connectionError: (state) => {
      return {
        ...state,
        wsConnected: false
      };
    },
    connectionClosed: (state) => {
      return {
        ...state,
        wsConnected: false
      };
    },
    getMessage: (state, {payload}: {
      payload: {
        orders: Array<TOrder>;
        total: number | null,
        totalToday: number | null
      }
    }) => {
      return {
        ...state,
        orders: payload.orders,
        total: payload.total,
        totalToday: payload.totalToday
      };
    },
  }
});

export const wsOrdersSlice = createSlice({
  name: 'wsOrders',
  initialState: initialWsOrdersState,
  reducers: {
    connectionInit: (state) => {
      return state;
    },
    connectionClose: (state) => {
      return state;
    },
    sendMessage: (state) => {
      return state;
    },
    connectionSuccess: (state) => {
      return {
        ...state,
        wsConnected: true
      };
    },
    connectionError: (state) => {
      return {
        ...state,
        wsConnected: false
      };
    },
    connectionClosed: (state) => {
      return {
        ...state,
        wsConnected: false
      };
    },
    getMessage: (state, {payload}: {
      payload: {
        orders: Array<TOrder>;
        total: number | null,
        totalToday: number | null
      }
    }) => {
      return {
        ...state,
        orders: payload.orders.reverse(),
        total: payload.total,
        totalToday: payload.totalToday
      };
    },
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrderState,
  reducers: {
    putOrderDetails: (state: TOrderState, {payload}: {
      payload: {
        number: number,
        name: string,
        status: {
          text: string,
          textColor: string
        },
        date: string,
        ingredients: Array<TIngredient>,
        totalPrice: number
      }
    }): TOrderState => {
      return {
        ...state,
        number: payload.number,
        name: payload.name,
        status: payload.status,
        date: payload.date,
        ingredients: payload.ingredients,
        totalPrice: payload.totalPrice
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state: TOrderState, {payload}: { payload: number }): TOrderState => {
        return {
          ...state,
          orderRequest: false,
          orderFailed: false,
          orderFailedTextError: '',
          number: payload
        };
      })
      .addCase(createOrder.pending, (state: TOrderState): TOrderState => {
        return {
          ...state,
          orderRequest: true,
          orderFailed: false,
          orderFailedTextError: '',
        };
      })
      .addCase(createOrder.rejected, (state: TOrderState, {payload}): TOrderState => {
        return {
          ...state,
          orderRequest: false,
          orderFailed: true,
          orderFailedTextError: payload as string,
          number: initialOrderState.number
        };
      })
  }
});

export const wsOrdersActions = wsOrdersSlice.actions;
export const wsOrdersAllActions = wsOrdersAllSlice.actions;

export const wsOrdersReducer = wsOrdersSlice.reducer;
export const wsOrdersAllReducer = wsOrdersAllSlice.reducer;
export const orderReducer = orderSlice.reducer;
