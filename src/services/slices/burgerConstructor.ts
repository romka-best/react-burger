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
    addOnlyIngredient: (state, {payload}: { payload: IngredientParams }) => {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          payload
        ]
      }
    },
    addIngredient: (state, {payload}: { payload: IngredientParams }) => {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          payload
        ],
        totalPrice: state.totalPrice + payload.price
      }
    },
    removeOnlyIngredient: (state, action) => {
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
    removeIngredient: (state, {payload: removedIngredient}: { payload: IngredientParams }) => {
      let findId = false;
      return {
        ...state,
        ingredients: [...state.ingredients].filter((ingredient) => {
          if (ingredient._id === removedIngredient._id && !findId) {
            findId = true;
            return false;
          }
          return true;
        }),
        totalPrice: state.totalPrice - removedIngredient.price
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
    addBuns: (state, {payload: bun}: { payload: IngredientParams }) => {
      let totalPrice = state.totalPrice;
      if (state.buns.length > 0) {
        totalPrice -= state.buns[0].price;
        totalPrice -= state.buns[1].price;
      }
      return {
        ...state,
        buns: [bun, bun],
        totalPrice: totalPrice + bun.price * 2
      }
    },
    addOnlyBuns: (state, {payload}: { payload: IngredientParams }) => {
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
