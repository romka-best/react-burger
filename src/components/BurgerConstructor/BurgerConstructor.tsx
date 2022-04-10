import React from 'react';
import PropTypes from 'prop-types';

import {ConstructorElement, DragIcon, CurrencyIcon, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import burgerConstructorStyles from './BurgerConstructor.module.css';

const BurgerConstructor = ({products}) => {
  return (
    <section className={`${burgerConstructorStyles.root} mt-25`}>
      <div className={burgerConstructorStyles.ingredients}>
        <div className={`${burgerConstructorStyles.constructorElement} mr-4`}>
          <ConstructorElement
            type={'top'}
            isLocked
            text={`${products[0].name} (верх)`}
            price={products[0].price}
            thumbnail={products[0].image}/>
        </div>
        <ul className={`${burgerConstructorStyles.list} mt-4 mb-4 ml-4`}>
          {products.slice(1, products.length - 1).map((product, index) => {
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
            text={`${products[products.length - 1].name} (низ)`}
            price={products[products.length - 1].price}
            thumbnail={products[products.length - 1].image}/>
        </div>
      </div>
      <div className={`${burgerConstructorStyles.info} mt-10 mr-4`}>
        <div className={`${burgerConstructorStyles.priceBlock} mr-10`}>
          <p className={`${burgerConstructorStyles.price} text text_type_digits-medium mr-2`}>610</p>
          <div className={burgerConstructorStyles.icon}>
            <CurrencyIcon type={'primary'}/>
          </div>
        </div>
        <Button type="primary" size="medium">
          Оформить заказ
        </Button>
      </div>
    </section>
  );
}

BurgerConstructor.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default BurgerConstructor;