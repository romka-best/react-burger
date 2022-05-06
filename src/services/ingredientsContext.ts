import React from 'react';

import {defaultIngredientParams} from '../utils/types';

export const IngredientsContext = React.createContext(
  {
    ingredients: [],
    bun: defaultIngredientParams,
    other: [],
  }
);