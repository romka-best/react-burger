import React from 'react';
import PropTypes from 'prop-types';
import {ConstructorElement, DragIcon, CurrencyIcon, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {IngredientParams} from '../../utils/types';

import burgerConstructorStyles from './BurgerConstructor.module.css';

const BurgerConstructor = ({ingredients, onClickModal}) => {
  const buns: IngredientParams[] = [];
  const other: IngredientParams[] = [];
  let sum = 0;

  for (let i = 0; i < ingredients.length; i++) {
    if (ingredients[i].type === 'bun') {
      buns.push(ingredients[i])
    } else {
      other.push(ingredients[i])
    }
    sum += ingredients[i].price;
  }

  const handleClickButton = () => {
    onClickModal(elementsRef.current);
  }

  const elementsRef = React.useRef(null);

  return (
    <section className={`${burgerConstructorStyles.root} mt-25`}>
      <div className={burgerConstructorStyles.ingredients} ref={elementsRef}>
        <div className={`${burgerConstructorStyles.constructorElement} mr-4`}>
          <ConstructorElement
            type={'top'}
            isLocked
            text={`${buns[0].name} (верх)`}
            price={buns[0].price}
            thumbnail={buns[0].image}/>
        </div>
        <ul className={`${burgerConstructorStyles.list} mt-4 mb-4 ml-4`}>
          {other.map((product, index) => {
            const {
              name,
              price,
              image,
            } = product;

            return (
              <li key={product._id} className={`${burgerConstructorStyles.element} mr-2`}>
                <DragIcon type={'primary'}/>
                <ConstructorElement
                  isLocked={false}
                  text={name}
                  price={price}
                  thumbnail={image}/>
              </li>
            );
          })}
        </ul>
        <div className={`${burgerConstructorStyles.constructorElement} mr-4`}>
          <ConstructorElement
            type={'bottom'}
            isLocked
            text={`${buns[0].name} (низ)`}
            price={buns[0].price}
            thumbnail={buns[0].image}/>
        </div>
      </div>
      <div className={`${burgerConstructorStyles.info} mt-10 mr-4`}>
        <div className={`${burgerConstructorStyles.priceBlock} mr-10`}>
          <p className={`${burgerConstructorStyles.price} text text_type_digits-medium mr-2`}>{sum}</p>
          <div className={burgerConstructorStyles.icon}>
            <CurrencyIcon type={'primary'}/>
          </div>
        </div>
        <Button type="primary" size="medium" onClick={handleClickButton}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
}

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickModal: PropTypes.func.isRequired,
}

export default BurgerConstructor;