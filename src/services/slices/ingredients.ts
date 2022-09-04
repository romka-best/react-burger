import {AxiosError, AxiosResponse} from 'axios';
import {createSlice, createAsyncThunk, AsyncThunk, ActionReducerMapBuilder, Reducer} from '@reduxjs/toolkit';

import DataService from '../dataService';
import {
  TIngredient,
  TIngredientsState,
} from '../../utils/types';
import {defaultIngredientParams} from '../../utils/defaultData';

const initialIngredientsState: TIngredientsState = {
  ingredients: [],
  currentIngredient: defaultIngredientParams,
  ingredientsRequest: true,
  ingredientsFailed: false,
  ingredientsFailedTextError: '',
}

export const getIngredients: AsyncThunk<any, void, any> = createAsyncThunk(
  'ingredients/getIngredients',
  async (_, thunkApi): Promise<any> => {
    try {
      const res: AxiosResponse = await DataService.getAllIngredients();
      return res.data.data;
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
    }
    return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialIngredientsState,
  reducers: {
    putIngredientDetails: (state: TIngredientsState, {payload}: { payload: TIngredient }): TIngredientsState => {
      return {
        ...state,
        currentIngredient: payload
      }
    },
    removeIngredientDetails: (state: TIngredientsState): TIngredientsState => {
      return {
        ...state,
        currentIngredient: defaultIngredientParams
      }
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<TIngredientsState>) => {
    builder
      .addCase(getIngredients.fulfilled, (state: TIngredientsState, {payload}: { payload: Array<TIngredient> }): TIngredientsState => {
        return {
          ...state,
          ingredientsRequest: false,
          ingredientsFailed: false,
          ingredientsFailedTextError: '',
          ingredients: payload
        };
      })
      .addCase(getIngredients.pending, (state: TIngredientsState): TIngredientsState => {
        return {
          ...state,
          ingredientsRequest: true,
          ingredientsFailed: false,
          ingredientsFailedTextError: ''
        }
      })
      .addCase(getIngredients.rejected, (state: TIngredientsState, {payload}): TIngredientsState => {
        return {
          ...state,
          ingredientsRequest: false,
          ingredientsFailed: true,
          ingredientsFailedTextError: payload as string,
        }
      })
  }
});

export const ingredientsReducer: Reducer<TIngredientsState> = ingredientsSlice.reducer;
