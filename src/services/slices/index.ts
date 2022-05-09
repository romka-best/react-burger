import {createSlice, createAsyncThunk, combineReducers} from '@reduxjs/toolkit';
import DataService from '../dataService';
import {
  defaultIngredientParams,
  IngredientParams, InitialBurgerConstructorParams,
  InitialIngredientsParams,
  InitialOrderParams
} from '../../utils/types';

const initialIngredientsState: InitialIngredientsParams = {
  ingredients: [],
  currentIngredient: defaultIngredientParams,
  ingredientsRequest: true,
  ingredientsFailed: false,
  ingredientsFailedTextError: '',
}

const initialOrderState: InitialOrderParams = {
  number: -1
}

const initialBurgerConstructorState: InitialBurgerConstructorParams = {
  ingredients: [],
  buns: [],
  totalPrice: 0,
}

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async (_, thunkApi) => {
    const res = await DataService.getAllIngredients();
    switch (res.status) {
      case 200: {
        return res.data.data;
      }
      case 404:
        return thunkApi.rejectWithValue(`Мы не смогли найти то, что вы искали 🔎 Статус ошибки: ${res.status}`);
      case 500:
        return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${res.status}`);
      default:
        return thunkApi.rejectWithValue(`Произошла неизвестная ошибка. Код ошибки: ${res.status}`);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[], thunkApi) => {
    const res = await DataService.createOrder(ingredients);
    switch (res.status) {
      case 200: {
        return res.data.order.number;
      }
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

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialBurgerConstructorState,
  reducers: {
    addIngredient: (state, {payload}: { payload: IngredientParams }) => {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          payload
        ]
      }
    },
    removeIngredient: (state, action) => {
      let findId = false;
      return {
        ...state,
        ingredients: [...state.ingredients].filter((ingredient) => {
          if (ingredient._id === action.payload && !findId) {
            findId = true;
            return false;
          }
          return true;
        })
      }
    },
    addBuns: (state, {payload}: { payload: IngredientParams }) => {
      return {
        ...state,
        buns: [
          payload,
          payload
        ]
      }
    },
    removeBuns: (state) => {
      return {
        ...state,
        buns: []
      }
    },
    incrementTotalPrice: (state, action) => {
      return {
        ...state,
        totalPrice: state.totalPrice + action.payload
      }
    },
    decrementTotalPrice: (state, action) => {
      return {
        ...state,
        totalPrice: state.totalPrice - action.payload
      }
    },
    changeSort: (state, action) => {
      const newOrder = [...state.ingredients]
      newOrder[action.payload.dragIndex] = action.payload.hoverItem
      newOrder[action.payload.hoverIndex] = action.payload.dragItem
      return {
        ...state,
        ingredients: newOrder
      };
    }
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState: initialOrderState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state, action) => {
      return {
        ...state,
        number: action.payload
      }
    })
  }
});

const ingredientsReducer = ingredientsSlice.reducer;
const burgerConstructorReducer = burgerConstructorSlice.reducer;
const orderReducer = orderSlice.reducer;

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer
});

export default rootReducer;
