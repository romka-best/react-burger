import {TBurger, TIngredient, TOrder, TStatusOrders, AppDispatch} from './types';

import {History} from 'history';

import {logout} from '../services/slices/user';

export const isCorrectEmail = (email: string): boolean => {
  return Boolean(
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  );
};

export const isCorrectPassword = (password: string): boolean => {
  return Boolean(
    String(password)
      .match(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/
      )
  );
}

export const isCorrectName = (name: string): boolean => {
  return Boolean(
    String(name)
      .match(
        /^[0-9a-zA-Zа-яА-Я]{2,}$/
      )
  )
}

export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name: string, value: null | string, props: { [x: string]: any; expires: any }): void {
  if (props.expires) {
    const d = new Date();
    d.setTime(d.getTime() + props.expires * 1000);
    props.expires = d;
  }
  if (props.expires && props.expires.toUTCString) {
    props.expires = props.expires.toUTCString();
  }
  if (value) {
    value = encodeURIComponent(value);
  }
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string): void {
  setCookie(name, null, {expires: -1});
}

export const countOrders = (orders: Array<TOrder>): TStatusOrders => {
  const statusOrders: TStatusOrders = {
    ready: [],
    inWork: []
  };

  orders.forEach((order: TOrder) => {
    switch (order.status) {
      case 'done':
        statusOrders.ready.push(order.number);
        break;
      case 'pending':
        statusOrders.inWork.push(order.number);
        break
    }
  });

  return statusOrders;
}

export const getBurgerFromIngredientsIds = (allIngredients: Array<TIngredient>,
                                               ingredientsIds: Array<string>,
                                               isUnique: boolean): TBurger => {
  const bun: TIngredient = ingredientsIds.map((currentIngredientId: string) => {
    return allIngredients.filter((ingredient: TIngredient) => {
      return currentIngredientId === ingredient._id && ingredient.type === 'bun';
    })[0];
  })[0];

  const other: Array<TIngredient> = ingredientsIds.map((currentIngredientId: string) => {
    return allIngredients.filter((ingredient: TIngredient) => {
      return currentIngredientId === ingredient._id && ingredient.type !== 'bun';
    })[0];
  });

  if (isUnique) {
    const unique: Array<string> = [];
    return {
      bun,
      other: other.filter((ingredient: TIngredient) => {
        if (ingredient) {
          if (unique.indexOf(ingredient._id) !== -1) {
            return false;
          } else {
            unique.push(ingredient._id);
            return true;
          }
        }
        return false;
      })
    }
  } else {
    return {
      bun,
      other: other.filter((ingredient: TIngredient) => {
        return ingredient !== undefined;
      })
    }
  }
}

export const createCardDate = (date: string): string => {
  const dayCreated: Date = new Date(date);
  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime: number = Math.ceil((today.getTime() - dayCreated.getTime()) / (60 * 60 * 24 * 1000));
  const hours: number | string = dayCreated.getHours() > 9 ? dayCreated.getHours() : `0${dayCreated.getHours()}`
  const min: number | string = dayCreated.getMinutes() > 9 ? dayCreated.getMinutes() : `0${dayCreated.getMinutes()}`

  return `${getCardDate(diffTime)}, ${hours}:${min} i-GMT+${dayCreated.getTimezoneOffset() * (-1) / 60}`;
};

export const getTotalCost = (bun: TIngredient | null, arrayOtherIngredients: Array<TIngredient>): number => {
  const bunPrice: number = bun ? bun.price : 0;
  return (
    bunPrice * 2 + arrayOtherIngredients.reduce((acc, curr) => (acc + curr.price), 0)
  );
};

const getCardDate = (days: number): string => (
  days === 0 ? 'Сегодня'
    : days === 1 ? 'Вчера'
      : days > 1 ? `${days} дня(-ей) назад`
        : 'Недавно'
);

export const getStatus = (status: string): { text: string, textColor: string } => {
  return status === 'done'
    ? {text: 'Выполнен', textColor: 'success'}
    : status === 'pending'
      ? {text: 'Готовится', textColor: 'primary'}
      : {text: 'Отменен', textColor: 'error'};
}

export const exit = (dispatch: AppDispatch, history: History): void => {
  dispatch(logout())
    .unwrap()
    .then((res) => {
      if (res.success) {
        history.replace({pathname: '/login'});
      }
    });
}
