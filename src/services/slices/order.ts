import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import DataService from '../dataService';
import {
  InitialOrderParams
} from '../../utils/types';

const initialOrderState: InitialOrderParams = {
  number: -1,
  orderRequest: false,
  orderFailed: false,
  orderFailedTextError: '',
}

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[], thunkApi) => {
    const res = await DataService.createOrder(ingredients);
    if (200 <= res.status && res.status <= 299) {
      return res.data.order.number;
    }
    switch (res.status) {
      case 404:
        return thunkApi.rejectWithValue(`Мы не смогли найти то, что вы искали 🔎 Статус ошибки: ${res.status}`);
      case 500:
        return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${res.status}`);
      default:
        return thunkApi.rejectWithValue(`Произошла неизвестная ошибка. Код ошибки: ${res.status}`);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrderState,
  reducers: {},
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
          orderFailedTextError: action.toString(),
          number: initialOrderState.number
        };
      })
  }
});

export const orderReducer = orderSlice.reducer;
