import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import DataService from '../dataService';
import {
  InitialOrderParams, InitialWsParams
} from '../../utils/types';
import {AxiosError} from 'axios';

const initialOrderState: InitialOrderParams = {
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

const initialWsOrdersAllState: InitialWsParams = {
  wsConnected: false,
  error: null,
  orders: [],
  total: null,
  totalToday: null,
};

const initialWsOrdersState: InitialWsParams = {
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
      return res.data.order.number;
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
    connectionInit: (state: InitialWsParams): InitialWsParams => {
      return state;
    },
    connectionClose: (state: InitialWsParams): InitialWsParams => {
      return state;
    },
    sendMessage: (state: InitialWsParams): InitialWsParams => {
      return state;
    },
    connectionSuccess: (state: InitialWsParams): InitialWsParams => {
      return {
        ...state,
        wsConnected: true
      };
    },
    connectionError: (state: InitialWsParams): InitialWsParams => {
      return {
        ...state,
        wsConnected: false
      };
    },
    connectionClosed: (state: InitialWsParams): InitialWsParams => {
      return {
        ...state,
        wsConnected: false
      };
    },
    getMessage: (state: InitialWsParams, action): InitialWsParams => {
      return {
        ...state,
        orders: action.payload.orders,
        total: action.payload.total,
        totalToday: action.payload.totalToday
      };
    },
  }
});

export const wsOrdersSlice = createSlice({
  name: 'wsOrders',
  initialState: initialWsOrdersState,
  reducers: {
    connectionInit: (state: InitialWsParams): InitialWsParams => {
      return state;
    },
    connectionClose: (state: InitialWsParams): InitialWsParams => {
      return state;
    },
    sendMessage: (state: InitialWsParams): InitialWsParams => {
      return state;
    },
    connectionSuccess: (state: InitialWsParams): InitialWsParams => {
      return {
        ...state,
        wsConnected: true
      };
    },
    connectionError: (state: InitialWsParams): InitialWsParams => {
      return {
        ...state,
        wsConnected: false
      };
    },
    connectionClosed: (state: InitialWsParams): InitialWsParams => {
      return {
        ...state,
        wsConnected: false
      };
    },
    getMessage: (state: InitialWsParams, action): InitialWsParams => {
      return {
        ...state,
        orders: action.payload.orders.reverse(),
        total: action.payload.total,
        totalToday: action.payload.totalToday
      };
    },
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrderState,
  reducers: {
    putOrderDetails: (state, action) => {
      return {
        ...state,
        number: action.payload.number,
        name: action.payload.name,
        status: action.payload.status,
        date: action.payload.date,
        ingredients: action.payload.ingredients,
        totalPrice: action.payload.totalPrice
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        return {
          ...state,
          orderRequest: false,
          orderFailed: false,
          orderFailedTextError: '',
          number: action.payload
        };
      })
      .addCase(createOrder.pending, (state) => {
        return {
          ...state,
          orderRequest: true,
          orderFailed: false,
          orderFailedTextError: '',
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        return {
          ...state,
          orderRequest: false,
          orderFailed: true,
          orderFailedTextError: action.payload as string,
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
