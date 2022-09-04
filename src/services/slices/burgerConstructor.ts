import {createSlice, Reducer} from '@reduxjs/toolkit';
import {
  TIngredient, TBurgerConstructorState,
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
    addOnlyIngredient: (state: TBurgerConstructorState, {payload}: { payload: TIngredient }): TBurgerConstructorState => {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          payload
        ]
      }
    },
    addIngredient: (state: TBurgerConstructorState, {payload}: { payload: TIngredient }): TBurgerConstructorState => {
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          payload
        ],
        totalPrice: state.totalPrice + payload.price
      }
    },
    removeOnlyIngredient: (state: TBurgerConstructorState, {payload}: { payload: string }): TBurgerConstructorState => {
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
    removeIngredient: (state: TBurgerConstructorState, {payload: removedIngredient}: { payload: TIngredient }): TBurgerConstructorState => {
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
    clearAll: (state: TBurgerConstructorState): TBurgerConstructorState => {
      return {
        ...state,
        ingredients: [],
        buns: [],
        totalPrice: 0
      }
    },
    addBuns: (state: TBurgerConstructorState, {payload: bun}: { payload: TIngredient }): TBurgerConstructorState => {
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
    addOnlyBuns: (state: TBurgerConstructorState, {payload}: { payload: TIngredient }): TBurgerConstructorState => {
      return {
        ...state,
        buns: [
          payload,
          payload
        ]
      }
    },
    removeBuns: (state: TBurgerConstructorState): TBurgerConstructorState => {
      return {
        ...state,
        buns: []
      }
    },
    incrementTotalPrice: (state: TBurgerConstructorState, {payload}: { payload: number }) => {
      return {
        ...state,
        totalPrice: state.totalPrice + payload
      }
    },
    decrementTotalPrice: (state: TBurgerConstructorState, {payload}: { payload: number }): TBurgerConstructorState => {
      return {
        ...state,
        totalPrice: state.totalPrice - payload
      }
    },
    changeSort: (state: TBurgerConstructorState, {payload}: {
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

export const burgerConstructorReducer: Reducer<TBurgerConstructorState> = burgerConstructorSlice.reducer;
