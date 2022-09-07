import * as React from 'react';

import {useAppSelector} from '../../services/store';

import done from '../../assets/images/done.png';

import createdOrderDetailsStyles from './CreatedOrderDetails.module.scss';

const CreatedOrderDetails: React.FC = () => {
  const number = useAppSelector(
    (state) => {
      return state.order.number
    }
  );

  return (
    <div className={`${createdOrderDetailsStyles.root}`}>
      <h2 className={`${createdOrderDetailsStyles.orderNumber} text text_type_digits-large`}>{number}</h2>
      <p className={`${createdOrderDetailsStyles.text} text text_type_main-medium`}>идентификатор заказа</p>
      <img className={`${createdOrderDetailsStyles.done}`} alt={'Успешно'} src={done}/>
      <p className={`${createdOrderDetailsStyles.text} text text_type_main-default`}>Ваш заказ начали готовить</p>
      <p className={`${createdOrderDetailsStyles.text} text text_type_main-default text_color_inactive`}>
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
}

export default CreatedOrderDetails;
