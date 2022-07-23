import React from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';

import {IngredientParams, LocationState, ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {getIngredients, ingredientsSlice} from '../../services/slices/ingredients';

import ingredientDetailsStyle from './IngredientDetails.module.scss';

const IngredientDetails = () => {
  const dispatch = useAppDispatch();
  const location = useLocation<LocationState>();
  const {params} = useRouteMatch<{ id: string }>();
  const currentIngredient = useAppSelector((state: ReducersParams) => {
    return state.ingredients.currentIngredient;
  });

  React.useEffect(
    () => {
      if (currentIngredient._id === '') {
        dispatch(getIngredients())
          .unwrap()
          .then((allIngredients) => {
            const ingredient = allIngredients.filter((ingredient: IngredientParams) => ingredient._id === params.id)[0];
            dispatch(ingredientsSlice.actions.putIngredientDetails(ingredient));
          });
      }
    }, [params, currentIngredient._id, dispatch]
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
