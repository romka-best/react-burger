import {createSlice} from '@reduxjs/toolkit';
import {
  IngredientParams, InitialBurgerConstructorParams,
} from '../../utils/types';

const initialBurgerConstructorState: InitialBurgerConstructorParams = {
  ingredients: [],
  buns: [],
  totalPrice: 0,
}

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
    clearAll: (state) => {
      return {
        ...state,
        ingredients: [],
        buns: [],
        totalPrice: 0
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

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
