import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner/Spinner';
import CustomError from '../CustomError/CustomError';
import BurgerIngredients from '../BurgerIngridients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';

import mainStyles from './Main.module.css';

const Main = ({state, onClickModal}) => {
  const {ingredients, isLoading, hasError, textError} = state;
  return (
    <main className={`${mainStyles.root}`}>
      {isLoading && !hasError && (<Spinner/>)}
      {hasError && !isLoading && (
        <CustomError textError={textError}/>
      )}
      {!isLoading && !hasError &&
      (<>
        <BurgerIngredients ingredients={ingredients} onClickModal={onClickModal}/>
        <BurgerConstructor ingredients={ingredients} onClickModal={onClickModal}/>
      </>)
      }
    </main>
  );
}

const mainPropTypes = PropTypes.shape({
  currentPage: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired
});

Main.propTypes = {
  state: mainPropTypes.isRequired,
  onClickModal: PropTypes.func.isRequired,
}

export default Main;
