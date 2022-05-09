import React from 'react';
import PropTypes from 'prop-types';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {useSelector, useDispatch} from 'react-redux';

import Spinner from '../Spinner/Spinner';
import CustomError from '../CustomError/CustomError';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';

import {getIngredients} from '../../services/slices';
import {AppDispatch} from '../../services/store';

import {ReducersParams} from '../../utils/types';

import mainStyles from './Main.module.css';

const Main = ({onClickModal}) => {
  const dispatch: AppDispatch = useDispatch();
  const {ingredientsRequest, ingredientsFailed, ingredientsFailedTextError} = useSelector((state: ReducersParams) => {
    return state.ingredients;
  });

  React.useEffect(
    () => {
      dispatch(getIngredients());
    }, [dispatch]
  );

  return (
    <main className={`${mainStyles.root}`}>
      {ingredientsRequest && !ingredientsFailed && (<Spinner/>)}
      {ingredientsFailed && !ingredientsRequest && (
        <CustomError textError={ingredientsFailedTextError}/>
      )}
      {!ingredientsRequest && !ingredientsFailed &&
      (
        <DndProvider backend={HTML5Backend}>
          <BurgerIngredients onClickModal={onClickModal}/>
          <BurgerConstructor onClickModal={onClickModal}/>
        </DndProvider>
      )
      }
    </main>
  );
}

const mainPropTypes = PropTypes.shape({
  currentPage: PropTypes.string.isRequired,
});

Main.propTypes = {
  state: mainPropTypes.isRequired,
  onClickModal: PropTypes.func.isRequired,
}

export default Main;
