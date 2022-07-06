import {createSlice} from '@reduxjs/toolkit';
import {
  InitialModalParams
} from '../../utils/types';

const initialModalState: InitialModalParams = {
  modalIsVisible: false,
  modalType: '',
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialModalState,
  reducers: {
    openModal: (state, action) => {
      return {
        ...state,
        modalIsVisible: true,
        modalType: action.payload
      }
    },
    closeModal: (state) => {
      return {
        ...state,
        modalIsVisible: false,
        modalType: ''
      }
    },
  },
});

export const modalReducer = modalSlice.reducer;
