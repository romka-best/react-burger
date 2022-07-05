import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import DataService from '../dataService';
import {
  InitialIngredientsParams,
} from '../../utils/types';
import {defaultIngredientParams} from '../../utils/defaultData';
import {AxiosError} from "axios";

const initialIngredientsState: InitialIngredientsParams = {
  ingredients: [],
  currentIngredient: defaultIngredientParams,
  ingredientsRequest: true,
  ingredientsFailed: false,
  ingredientsFailedTextError: '',
}

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async (_, thunkApi) => {
    try {
      const res = await DataService.getAllIngredients();
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
    putIngredientDetails: (state, action) => {
      return {
        ...state,
        currentIngredient: action.payload
      }
    },
    removeIngredientDetails: (state, action) => {
      return {
        ...state,
        currentIngredient: defaultIngredientParams
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.fulfilled, (state, action) => {
        return {
          ...state,
          ingredientsRequest: false,
          ingredientsFailed: false,
          ingredientsFailedTextError: '',
          ingredients: action.payload
        };
      })
      .addCase(getIngredients.pending, (state) => {
        return {
          ...state,
          ingredientsRequest: true,
          ingredientsFailed: false,
          ingredientsFailedTextError: ''
        }
      })
      .addCase(getIngredients.rejected, (state, action) => {
        return {
          ...state,
          ingredientsRequest: false,
          ingredientsFailed: true,
          ingredientsFailedTextError: action.payload as string,
        }
      })
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
