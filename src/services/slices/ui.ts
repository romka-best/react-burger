import {createSlice} from '@reduxjs/toolkit';

import {
  TUIState
} from '../../utils/types';

const initialUiState: TUIState = {
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
    updateTypeDevice: (state, {payload}: { payload: number }) => {
      if (payload <= state.breakpoints.mobile) {
        return {
          ...state,
          width: payload,
          type: 'mobile'
        }
      } else if (payload <= state.breakpoints.tablet) {
        return {
          ...state,
          width: payload,
          type: 'tablet'
        }
      } else if (payload <= state.breakpoints.laptop) {
        return {
          ...state,
          width: payload,
          type: 'laptop'
        }
      }
      return {
        ...state,
        width: payload,
        type: 'desktop'
      }
    }
  }
});

export const uiReducer = uiSlice.reducer;
