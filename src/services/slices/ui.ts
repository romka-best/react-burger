import {createSlice} from '@reduxjs/toolkit';
import {
  InitialUiParams
} from '../../utils/types';

const initialUiState: InitialUiParams = {
  width: -1,
  type: 'desktop',
  breakpoints: {
    laptop: 1280,
    tablet: 768,
    mobile: 425,
  }
}

export const uiSlice = createSlice({
  name: 'order',
  initialState: initialUiState,
  reducers: {
    updateTypeDevice: (state, action) => {
      if (action.payload <= state.breakpoints.mobile) {
        return {
          ...state,
          width: action.payload,
          type: 'mobile'
        }
      } else if (action.payload <= state.breakpoints.tablet) {
        return {
          ...state,
          width: action.payload,
          type: 'tablet'
        }
      } else if (action.payload <= state.breakpoints.laptop) {
        return {
          ...state,
          width: action.payload,
          type: 'laptop'
        }
      }
      return {
        ...state,
        width: action.payload,
        type: 'desktop'
      }
    }
  }
});

export const uiReducer = uiSlice.reducer;
