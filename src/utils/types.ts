import PropTypes from 'prop-types';

interface IngredientParams {
  _id: string,
  name: string,
  type: string,
  proteins: number,
  fat: number,
  carbohydrates: number,
  calories: number,
  price: number,
  image: string,
  image_mobile: string,
  image_large: string,
  count?: number
}

interface ActionParams {
  type: string,
  value?: IngredientParams
}

interface InitialModalParams {
  modalIsVisible: boolean,
  modalType: '' | 'orderDetails' | 'ingredientDetails',
}

interface InitialIngredientsParams {
  ingredients: Array<IngredientParams>,
  currentIngredient: IngredientParams,
  ingredientsRequest: boolean,
  ingredientsFailed: boolean,
  ingredientsFailedTextError: string,
}

interface InitialBurgerConstructorParams {
  ingredients: Array<IngredientParams>,
  buns: Array<IngredientParams>,
  totalPrice: number,
}

interface InitialOrderParams {
  number: number,
  orderRequest: boolean,
  orderFailed: boolean,
  orderFailedTextError: string,
}

interface InitialUiParams {
  width: number,
  type: 'desktop' | 'laptop' | 'tablet' | 'mobile',
  breakpoints: {
    desktop?: number,
    laptop: number,
    tablet: number,
    mobile: number,
  }
}

interface InitialUserParams {
  isAuthenticated: boolean,
  email: string,
  name: string,
  userRequest: boolean,
  userFailed: boolean,
  userFailedTextError: string,
}

interface ReducersParams {
  user: InitialUserParams,
  modal: InitialModalParams,
  ingredients: InitialIngredientsParams,
  burgerConstructor: InitialBurgerConstructorParams,
  order: InitialOrderParams,
  ui: InitialUiParams,
}

interface ItemParams {
  index: number
}

interface LocationState {
  background: any;
  from: {
    pathname: string;
  };
}

const ingredientDetailsPropTypes = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  calories: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_mobile: PropTypes.string.isRequired,
  image_large: PropTypes.string.isRequired
});

export type {
  IngredientParams,
  InitialModalParams,
  InitialIngredientsParams,
  InitialOrderParams,
  InitialBurgerConstructorParams,
  InitialUiParams,
  InitialUserParams,
  ReducersParams,
  ItemParams,
  ActionParams,
  LocationState,
};

export {ingredientDetailsPropTypes};
