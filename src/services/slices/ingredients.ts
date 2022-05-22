import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import DataService from '../dataService';
import {
  InitialIngredientsParams,
} from '../../utils/types';
import {defaultIngredientParams} from '../../utils/defaultData';

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
    const res = await DataService.getAllIngredients();
    if (200 <= res.status && res.status <= 299) {
      return res.data.data;
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
          ingredientsFailedTextError: action.toString()
        }
      })
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
