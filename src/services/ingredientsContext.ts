import React from 'react';

export const IngredientsContext = React.createContext({
  ingredients: [],
  bun: {
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
  },
  other: []
});