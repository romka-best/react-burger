import React from 'react';

import {ReducersParams} from '../../utils/types';
import {useAppSelector} from '../../services/store';

import ingredientDetailsStyle from './IngredientDetails.module.css';


const IngredientDetails = () => {
  const currentIngredient = useAppSelector((state: ReducersParams) => {
    return state.ingredients.currentIngredient;
  })
  return (
    <div className={`${ingredientDetailsStyle.root} mt-10 mb-15`}>
      <h2 className={`${ingredientDetailsStyle.title} ml-10 text text_type_main-large`}>Детали ингредиента</h2>
      <img className={`${ingredientDetailsStyle.image} mr-5 ml-5`} src={currentIngredient.image_large}
           alt={currentIngredient.name}/>
      <p className={`${ingredientDetailsStyle.description} text text_type_main-medium mt-4 mb-8`}>{currentIngredient.name}</p>
      <ul className={`${ingredientDetailsStyle.values}`}>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive mb-2`}>Калории,ккал</p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>{currentIngredient.calories}</p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive mb-2`}>Белки, г</p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>{currentIngredient.proteins}</p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive mb-2`}>Жиры, г</p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>{currentIngredient.fat}</p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive mb-2`}>Углеводы, г</p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>{currentIngredient.carbohydrates}</p>
        </li>
      </ul>
    </div>
  );
}

export default IngredientDetails;
