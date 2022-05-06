import React from 'react';

import ingredientDetailsStyle from './IngredientDetails.module.css';
import {ingredientDetailsPropTypes} from '../../utils/types';


const IngredientDetails = ({ingredientDetails}) => {
  return (
    <div className={`${ingredientDetailsStyle.root} mt-10 mb-15`}>
      <h2 className={`${ingredientDetailsStyle.title} ml-10 text text_type_main-large`}>Детали ингредиента</h2>
      <img className={`${ingredientDetailsStyle.image} mr-5 ml-5`} src={ingredientDetails.image_large}
           alt={ingredientDetails.name}/>
      <p className={`${ingredientDetailsStyle.description} text text_type_main-medium mt-4 mb-8`}>{ingredientDetails.name}</p>
      <ul className={`${ingredientDetailsStyle.values}`}>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive mb-2`}>Калории,ккал</p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>{ingredientDetails.calories}</p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive mb-2`}>Белки, г</p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>{ingredientDetails.proteins}</p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive mb-2`}>Жиры, г</p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>{ingredientDetails.fat}</p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive mb-2`}>Углеводы, г</p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>{ingredientDetails.carbohydrates}</p>
        </li>
      </ul>
    </div>
  );
}

IngredientDetails.propTypes = {
  ingredientDetails: ingredientDetailsPropTypes.isRequired,
}

export default IngredientDetails;
