import React from 'react';
import PropTypes from 'prop-types';
import {ConstructorElement, DragIcon, CurrencyIcon, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {IngredientsContext} from '../../services/ingredientsContext';
import {TotalPriceContext} from '../../services/totalPriceContext';
import {BASE_URL} from '../../utils/constants';
import {IngredientParams} from '../../utils/types';

import burgerConstructorStyles from './BurgerConstructor.module.css';

const BurgerConstructor = ({onClickModal}) => {
  const bun: IngredientParams = React.useContext(IngredientsContext).bun;
  const other: IngredientParams[] = React.useContext(IngredientsContext).other;

  const totalPrice = React.useContext(TotalPriceContext).count;

  const handleClickButton = () => {
    const ingredients = [bun._id, bun._id];
    ingredients.push(...other.map((ingredient) => ingredient._id));
    fetch(
      `${BASE_URL}/orders`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ingredients
        })
      }
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        switch (res.status) {
          case 404:
            return Promise.reject(`Мы не смогли найти то, что вы искали 🔎 Статус ошибки: ${res.status}`);
          case 500:
            return Promise.reject(`Произошла ошибка на стороне сервера 🖥 Статус ошибки: ${res.status}`);
          default:
            return Promise.reject(`Произошла неизвестная ошибка. Код ошибки: ${res.status}`);
        }
      })
      .then(orderDetails => {
        onClickModal(elementsRef.current, orderDetails);
      })
      .catch(e => {
        return Promise.reject(`Произошла неизвестная ошибка. Название ошибки: ${e.toString()}`);
      });
  }

  const elementsRef = React.useRef(null);

  return (
    <section className={`${burgerConstructorStyles.root} mt-25`}>
      <div className={burgerConstructorStyles.ingredients} ref={elementsRef}>
        <div className={`${burgerConstructorStyles.constructorElement} mr-4`}>
          <ConstructorElement
            type={'top'}
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}/>
        </div>
        <ul className={`${burgerConstructorStyles.list} mt-4 mb-4 ml-4`}>
          {other.map((product) => {
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
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}/>
        </div>
      </div>
      <div className={`${burgerConstructorStyles.info} mt-10 mr-4`}>
        <div className={`${burgerConstructorStyles.priceBlock} mr-10`}>
          <p className={`${burgerConstructorStyles.price} text text_type_digits-medium mr-2`}>{totalPrice}</p>
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
  onClickModal: PropTypes.func.isRequired,
}

export default BurgerConstructor;