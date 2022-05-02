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
  image_large: string
}

const defaultIngredientParams = {
  _id: '',
  name: '',
  type: '',
  proteins: -1,
  fat: -1,
  carbohydrates: -1,
  calories: -1,
  price: -1,
  image: '',
  image_mobile: '',
  image_large: ''
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

export type {IngredientParams};
export {defaultIngredientParams, ingredientDetailsPropTypes};
