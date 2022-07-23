import React from 'react';

import {CurrencyIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import constructorElementMobileStyles from './ConstructorElementMobile.module.scss';

interface ConstructorElementMobileProps {
  text: string,
  price: number,
  thumbnail: string,
}

const ConstructorElementMobile = ({text, price, thumbnail}: ConstructorElementMobileProps) => {
  return (
    <div className={constructorElementMobileStyles.root}>
      <img className={constructorElementMobileStyles.image} src={thumbnail} alt={text}/>
      <p className={`${constructorElementMobileStyles.name} text text_type_main-default`}>{text}</p>
      <div className={constructorElementMobileStyles.price}>
        <p className={`${constructorElementMobileStyles.priceText} text text_type_digits-default`}>{price}</p>
        <CurrencyIcon type='primary'/>
      </div>
    </div>
  );
}

export default ConstructorElementMobile;