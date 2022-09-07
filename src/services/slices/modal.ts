import {createSlice} from '@reduxjs/toolkit';

import {
  TModalState
} from '../../utils/types';

const initialModalState: TModalState = {
  modalIsVisible: false,
  modalType: '',
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialModalState,
  reducers: {
    openModal: (state: TModalState, {payload}: { payload: '' | 'createdOrderDetails' | 'orderDetails' | 'ingredientDetails' }): TModalState => {
      return {
        ...state,
        modalIsVisible: true,
        modalType: payload
      }
    },
    closeModal: (state: TModalState): TModalState => {
      return {
        ...state,
        modalIsVisible: false,
        modalType: ''
      }
    },
  },
});

export const modalReducer = modalSlice.reducer;
