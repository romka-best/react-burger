import {createSlice, createAsyncThunk, AsyncThunk, ActionReducerMapBuilder} from '@reduxjs/toolkit';
import DataService from '../dataService';
import {TUserState, TUser} from '../../utils/types';
import {AxiosError, AxiosResponse} from 'axios';
import {deleteCookie, setCookie} from '../../utils/functions';

const initialUserState: TUserState = {
  isAuthenticated: false,
  email: '',
  name: '',
  userRequest: false,
  userFailed: false,
  userFailedTextError: '',
}

export const sendCodeForResetPassword: AsyncThunk<any, any, any> = createAsyncThunk(
  'user/sendCodeForResetPassword',
  async (email: string, thunkApi) => {
    try {
      const res: AxiosResponse = await DataService.sendCodeForResetPassword(email);
      return res.data.success ? res.data.success : thunkApi.rejectWithValue(`Что-то пошло не так, проверьте введенные данные 🧐`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 404:
            return thunkApi.rejectWithValue(`Мы не смогли вашу почту 📭 Статус ошибки: ${error.response.status}`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

export const signIn: AsyncThunk<any, any, any> = createAsyncThunk(
  'user/signIn',
  async (form: { email: string, password: string }, thunkApi) => {
    try {
      const res: AxiosResponse = await DataService.login(form.email, form.password);
      return res.data.success ? res.data : thunkApi.rejectWithValue(`При авторизации то-то пошло не так 🧐`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 401:
            return thunkApi.rejectWithValue(`Неправильно введён пароль или почта 😢`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

export const registration: AsyncThunk<any, any, any> = createAsyncThunk(
  'user/registration',
  async (form: { email: string, password: string, name: string }, thunkApi) => {
    try {
      const res: AxiosResponse = await DataService.createUser(form.email, form.password, form.name);
      return res.data.success ? res.data : thunkApi.rejectWithValue(`При регистрации что-то пошло не так 🧐`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 403:
            return thunkApi.rejectWithValue(`Такой пользователь уже есть 🤓`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

export const updateToken: AsyncThunk<any, void, any> = createAsyncThunk(
  'user/updateToken',
  async (_, thunkApi) => {
    try {
      const res: AxiosResponse = await DataService.updateToken();
      return res.data.success ? res.data : thunkApi.rejectWithValue(`При обновлении токена что-то пошло не так 🧐`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 401:
            return thunkApi.rejectWithValue(`Токен невалидный ☠️ Статус ошибки: ${error.response.status}`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

export const getUserInfo: AsyncThunk<any, void, any> = createAsyncThunk(
  'user/getUserInfo',
  async (_, thunkApi) => {
    try {
      const res: AxiosResponse = await DataService.getUserInfo();
      return res.data.success ? res.data : thunkApi.rejectWithValue(`При получении информации пользователя что-то пошло не так 🧐`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 401:
            return thunkApi.rejectWithValue(`Отсутствует авторизация 🔐`);
          case 403:
            return thunkApi.rejectWithValue(`Отсутствует авторизация 🔐`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

export const updateUserInfo: AsyncThunk<any, any, any> = createAsyncThunk(
  'user/updateUserInfo',
  async (data: TUser, thunkApi) => {
    try {
      const res: AxiosResponse = await DataService.updateUserInfo(data);
      return res.data.success ? res.data : thunkApi.rejectWithValue(`При получении информации пользователя что-то пошло не так 🧐`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 403:
            return thunkApi.rejectWithValue(`Такой пользователь уже есть 🤓`);
          case 401:
            return thunkApi.rejectWithValue(`Отсутствует авторизация 🔐`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

export const logout: AsyncThunk<any, void, any> = createAsyncThunk(
  'user/logout',
  async (_, thunkApi) => {
    try {
      const res: AxiosResponse = await DataService.logout();
      return res.data.success ? res.data : thunkApi.rejectWithValue(`При попытке выйти из аккаунта что-то пошло не так 🧐`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

export const resetPassword: AsyncThunk<any, any, any> = createAsyncThunk(
  'user/resetPassword',
  async (formValues: { token: string, password: string }, thunkApi) => {
    try {
      const res: AxiosResponse = await DataService.resetPassword(formValues.password, formValues.token);
      return res.data.success ? res.data.success : thunkApi.rejectWithValue(`Что-то пошло не так, проверьте введенные данные 🧐`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        switch (error.response.status) {
          case 0:
            return thunkApi.rejectWithValue(`Ошибка подключения к сети. Проверьте подключение к интернету, пожалуйста 🌐`);
          case 404:
            return thunkApi.rejectWithValue(`Введен некорректный код ❗️`);
          case 500:
            return thunkApi.rejectWithValue(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${error.response.status}`);
          default:
            return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥 Код ошибки: ${error.response.status}`);
        }
      }
      return thunkApi.rejectWithValue(`Произошла неизвестная ошибка 😥`);
    }
  }
);

const setTokens = (accessToken: string, refreshToken: string): void => {
  setCookie('accessToken', accessToken.split('Bearer ')[1], {expires: 1200});
  setCookie('refreshToken', refreshToken, {expires: 1800});
}

const removeTokens = (): void => {
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setDefaultApiState: (state: TUserState): TUserState => {
      return {
        ...state,
        userRequest: false,
        userFailed: false,
        userFailedTextError: '',
      }
    },
    forceLogin: (state: TUserState): TUserState => {
      return {
        ...state,
        isAuthenticated: true
      }
    },
    forceLogout: (state: TUserState): TUserState => {
      removeTokens();
      return {
        ...state,
        isAuthenticated: false,
        email: '',
        name: ''
      }
    }
  },
  extraReducers: (builder: ActionReducerMapBuilder<TUserState>) => {
    builder
      .addCase(sendCodeForResetPassword.fulfilled, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: false,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(sendCodeForResetPassword.pending, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: true,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(sendCodeForResetPassword.rejected, (state: TUserState, action): TUserState => {
        return {
          ...state,
          userRequest: false,
          userFailed: true,
          // @ts-ignore
          userFailedTextError: action.error.message ? 'Что-то пошло не так 😬' : action.toString()
        }
      })
      .addCase(resetPassword.fulfilled, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: false,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(resetPassword.pending, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: true,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(resetPassword.rejected, (state: TUserState, action): TUserState => {
        return {
          ...state,
          userRequest: false,
          userFailed: true,
          userFailedTextError: action.payload as string
        }
      })
      .addCase(signIn.fulfilled, (state: TUserState, action): TUserState => {
        setTokens(action.payload.accessToken, action.payload.refreshToken);
        return {
          ...state,
          isAuthenticated: true,
          email: action.payload.user.email,
          name: action.payload.user.name,
          userRequest: false,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(signIn.pending, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: true,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(signIn.rejected, (state: TUserState, {payload}): TUserState => {
        return {
          ...state,
          isAuthenticated: false,
          email: '',
          name: '',
          userRequest: false,
          userFailed: true,
          userFailedTextError: payload as string
        }
      })
      .addCase(registration.fulfilled, (state: TUserState, {payload}: {
        payload: {
          accessToken: string,
          refreshToken: string,
          user: {
            email: string,
            name: string
          }
        }
      }): TUserState => {
        setTokens(payload.accessToken, payload.refreshToken);
        return {
          ...state,
          isAuthenticated: true,
          email: payload.user.email,
          name: payload.user.name,
          userRequest: false,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(registration.pending, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: true,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(registration.rejected, (state: TUserState, {payload}): TUserState => {
        return {
          ...state,
          email: '',
          name: '',
          userRequest: false,
          userFailed: true,
          userFailedTextError: payload as string
        }
      })
      .addCase(updateToken.fulfilled, (state: TUserState, {payload}: {
        payload: {
          accessToken: string,
          refreshToken: string
        }
      }): TUserState => {
        setTokens(payload.accessToken, payload.refreshToken);
        return {
          ...state,
          isAuthenticated: true,
          userRequest: false,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(updateToken.pending, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: true,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(updateToken.rejected, (state: TUserState, {payload}): TUserState => {
        return {
          ...state,
          isAuthenticated: false,
          email: '',
          name: '',
          userRequest: false,
          userFailed: true,
          userFailedTextError: payload as string
        }
      })
      .addCase(getUserInfo.fulfilled, (state: TUserState, {payload}: {
        payload: {
          user: {
            email: string,
            name: string
          }
        }
      }): TUserState => {
        return {
          ...state,
          email: payload.user.email,
          name: payload.user.name,
          userRequest: false,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(getUserInfo.pending, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: true,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(getUserInfo.rejected, (state: TUserState, {payload}): TUserState => {
        return {
          ...state,
          userRequest: false,
          userFailed: true,
          userFailedTextError: payload as string
        }
      })
      .addCase(logout.fulfilled, (state: TUserState): TUserState => {
        removeTokens();
        return {
          ...state,
          isAuthenticated: false,
          email: '',
          name: '',
          userRequest: false,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(logout.pending, (state: TUserState): TUserState => {
        return {
          ...state,
          userRequest: true,
          userFailed: false,
          userFailedTextError: ''
        }
      })
      .addCase(logout.rejected, (state: TUserState, {payload}): TUserState => {
        return {
          ...state,
          userRequest: false,
          userFailed: true,
          userFailedTextError: payload as string
        }
      })
  }
});

export const userReducer = userSlice.reducer;
