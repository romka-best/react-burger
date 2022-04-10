import React from 'react';
import PropTypes from 'prop-types';

import BurgerIngredients from '../BurgerIngridients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';

import mainStyles from './Main.module.css';

const Main = (props) => {
  return (
    <main className={`${mainStyles.root}`}>
      <BurgerIngredients ingredients={props.data}/>
      <BurgerConstructor products={props.data}/>
    </main>
  );
}

Main.propTypes = {
  state: PropTypes.objectOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Main;
