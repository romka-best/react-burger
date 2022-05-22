import React from 'react';
import PropTypes from 'prop-types';

import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {TouchBackend} from 'react-dnd-touch-backend';

import Spinner from '../Spinner/Spinner';
import CustomError from '../CustomError/CustomError';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';

import {getIngredients} from '../../services/slices/ingredients';
import {useAppDispatch, useAppSelector} from '../../services/store';

import {ReducersParams} from '../../utils/types';

import mainStyles from './Main.module.scss';
import BurgerConstructorInfo from "../BurgerConstructorInfo/BurgerConstructorInfo";

interface MainProps {
  onClickModal: Function
}

const Main = ({onClickModal}: MainProps) => {
  const dispatch = useAppDispatch();
  const {
    ingredientsRequest,
    ingredientsFailed,
    ingredientsFailedTextError
  } = useAppSelector((state: ReducersParams) => {
    return state.ingredients;
  });

  const {orderRequest, orderFailed, orderFailedTextError} = useAppSelector((state: ReducersParams) => {
    return state.order;
  });

  const {type} = useAppSelector((state: ReducersParams) => {
    return state.ui;
  });

  React.useEffect(
    () => {
      dispatch(getIngredients());
    }, [dispatch]
  );

  return (
    <main className={`${mainStyles.root}`}>
      {(ingredientsRequest && !ingredientsFailed && (<Spinner/>)) ||
      (orderRequest && !orderFailed && (<Spinner/>))}
      {(ingredientsFailed && !ingredientsRequest && (
        <CustomError textError={ingredientsFailedTextError}/>
      )) || (orderFailed && !orderRequest && (
        <CustomError textError={orderFailedTextError}/>
      ))}
      {!ingredientsRequest && !ingredientsFailed && !orderRequest && !orderFailed &&
      (
        <>
          {
            type === 'desktop' || type === 'laptop' || type === 'tablet' ? (
              <DndProvider backend={HTML5Backend}>
                <BurgerIngredients onClickModal={onClickModal}/>
                <BurgerConstructor onClickModal={onClickModal}/>
              </DndProvider>
            ) : type === 'mobile' && (
              <DndProvider backend={TouchBackend}>
                <BurgerIngredients onClickModal={onClickModal}/>
                <BurgerConstructorInfo onClickModal={onClickModal}/>
              </DndProvider>
            )
          }
        </>
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
