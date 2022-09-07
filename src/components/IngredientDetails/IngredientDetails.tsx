import * as React from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';

import {TIngredient, TLocation} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {ingredientsSlice} from '../../services/slices/ingredients';

import {TRouteMatch} from './IngredientDetails.types';
import ingredientDetailsStyle from './IngredientDetails.module.scss';

const IngredientDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation<TLocation>();
  const {params} = useRouteMatch<TRouteMatch>();

  const {currentIngredient, ingredients, ingredientsRequest} = useAppSelector((state) => {
    return state.ingredients;
  });

  React.useEffect(
    (): void => {
      if (!ingredientsRequest && currentIngredient._id === '') {
        const ingredient: TIngredient = ingredients.filter((ingredient) => ingredient._id === params.id)[0];
        dispatch(ingredientsSlice.actions.putIngredientDetails(ingredient));
      }
    }, [params, currentIngredient._id, dispatch, ingredients, ingredientsRequest]
  );

  const background = location.state?.background;

  return (
    <div className={`${ingredientDetailsStyle.root} ${!background ? ingredientDetailsStyle.root_size_big : ''}`}>
      <h2
        className={`${ingredientDetailsStyle.title} ${!background ? ingredientDetailsStyle.title_size_big : ''} text text_type_main-large`}>
        Детали ингредиента
      </h2>
      <img className={`${ingredientDetailsStyle.image}`} src={currentIngredient.image_large}
           alt={currentIngredient.name}/>
      <p
        className={`${ingredientDetailsStyle.description} text text_type_main-medium`}>{currentIngredient.name}</p>
      <ul className={`${ingredientDetailsStyle.values}`}>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive`}>
            Калории,ккал
          </p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>
            {currentIngredient.calories}
          </p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive`}>
            Белки, г
          </p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>
            {currentIngredient.proteins}
          </p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive`}>
            Жиры, г
          </p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>
            {currentIngredient.fat}
          </p>
        </li>
        <li className={`${ingredientDetailsStyle.value}`}>
          <p className={`${ingredientDetailsStyle.typeText} text text_type_main-default text_color_inactive`}>
            Углеводы, г
          </p>
          <p className={`${ingredientDetailsStyle.valueText} text text_type_main-default text_color_inactive`}>
            {currentIngredient.carbohydrates}
          </p>
        </li>
      </ul>
    </div>
  );
}

export default IngredientDetails;
