import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {TouchBackend} from 'react-dnd-touch-backend';

import Spinner from '../../components/Spinner/Spinner';
import CustomError from '../../components/CustomError/CustomError';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';

import {useAppSelector} from '../../services/store';

import mainStyles from './MainPage.module.scss';

const MainPage = () => {
  const {
    ingredientsRequest,
    ingredientsFailed,
    ingredientsFailedTextError
  } = useAppSelector((state) => {
    return state.ingredients;
  });

  const {orderRequest, orderFailed, orderFailedTextError} = useAppSelector((state) => {
    return state.order;
  });

  const {type} = useAppSelector((state) => {
    return state.ui;
  });

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
                <BurgerIngredients/>
                <BurgerConstructor/>
              </DndProvider>
            ) : type === 'mobile' && (
              <DndProvider backend={TouchBackend}>
                <BurgerIngredients/>
                <BurgerConstructor/>
              </DndProvider>
            )
          }
        </>
      )
      }
    </main>
  );
}

export default MainPage;
