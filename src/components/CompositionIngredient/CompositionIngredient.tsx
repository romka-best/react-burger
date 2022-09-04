import * as React from 'react';

import {CurrencyIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import compositionIngredientStyles from './CompositionIngredient.module.scss';

interface ICompositionIngredient {
  name: string,
  count: number,
  price: number,
  photo: string,
}

const CompositionIngredient: React.FC<ICompositionIngredient> = ({
                                                                   name,
                                                                   count,
                                                                   price,
                                                                   photo
                                                                 }: ICompositionIngredient) => {
  return (
    <li className={compositionIngredientStyles.root}>
      <div className={compositionIngredientStyles.ingredient}>
        <img className={compositionIngredientStyles.ingredient__photo} alt={name} src={photo}/>
      </div>
      <p className={`${compositionIngredientStyles.name} text text_type_main-default`}>{name}</p>
      <div className={compositionIngredientStyles.priceBlock}>
        <p className={`${compositionIngredientStyles.price} text text_type_digits-default`}>{count} x {price}</p>
        <CurrencyIcon type={'primary'}/>
      </div>
    </li>
  );
}

export default CompositionIngredient;
