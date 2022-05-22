import React from 'react';
import PropTypes from 'prop-types';

import {ConstructorElement, CurrencyIcon, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import {ReducersParams} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';

import burgerConstructorInfoStyles from './BurgerConstructorInfo.module.scss';


interface BurgerConstructorProps {
  onClickModal: Function
}

const BurgerConstructorInfo = ({onClickModal}: BurgerConstructorProps) => {
  const {totalPrice} = useAppSelector(
    (state: ReducersParams) => state.burgerConstructor
  );

  return (
    <footer className={burgerConstructorInfoStyles.root}>
      <div className={burgerConstructorInfoStyles.priceBlock}>
        <p className={`${burgerConstructorInfoStyles.price} text text_type_digits-default`}>{totalPrice}</p>
        <div className={burgerConstructorInfoStyles.icon}>
          <CurrencyIcon type={'primary'}/>
        </div>
      </div>
      <Button type='primary' size='small'>
        Смотреть заказ
      </Button>
    </footer>
  );
}

BurgerConstructorInfo.propTypes = {
  onClickModal: PropTypes.func.isRequired,
}

export default BurgerConstructorInfo;