import {createSlice} from '@reduxjs/toolkit';
import {
  TIngredient,
  TBurgerConstructorState,
} from '../../utils/types';

const initialBurgerConstructorState: TBurgerConstructorState = {
  ingredients: [],
  buns: [],
  totalPrice: 0,
}

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialBurgerConstructorState,
  reducers: {
    addOnlyIngredient: (state, {payload}: { payload: TIngredient }) => {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          payload
        ]
      }
    },
    addIngredient: (state, {payload}: { payload: TIngredient }) => {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          payload
        ],
        totalPrice: state.totalPrice + payload.price
      }
    },
    removeOnlyIngredient: (state, {payload}: { payload: string }) => {
      let findId: boolean = false;
      return {
        ...state,
        ingredients: [...state.ingredients].filter((ingredient) => {
          if (ingredient._id === payload && !findId) {
            findId = true;
            return false;
          }
          return true;
        })
      }
    },
    removeIngredient: (state, {payload: removedIngredient}: { payload: TIngredient }) => {
      let findId: boolean = false;
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
    addBuns: (state, {payload: bun}: { payload: TIngredient }) => {
      let totalPrice: number = state.totalPrice;
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
    addOnlyBuns: (state, {payload}: { payload: TIngredient }) => {
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
    incrementTotalPrice: (state, {payload}: { payload: number }) => {
      return {
        ...state,
        totalPrice: state.totalPrice + payload
      }
    },
    decrementTotalPrice: (state, {payload}: { payload: number }) => {
      return {
        ...state,
        totalPrice: state.totalPrice - payload
      }
    },
    changeSort: (state, {payload}: {
      payload: {
        dragIndex: number,
        hoverIndex: number,
        hoverItem: TIngredient,
        dragItem: TIngredient
      }
    }) => {
      const newOrder = [...state.ingredients]
      newOrder[payload.dragIndex] = payload.hoverItem
      newOrder[payload.hoverIndex] = payload.dragItem
      return {
        ...state,
        ingredients: newOrder
      };
    }
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
