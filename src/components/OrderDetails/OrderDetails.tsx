import {useAppSelector} from '../../services/store';
import {ReducersParams} from '../../utils/types';

import done from '../../assets/images/done.png';

import orderDetailsStyles from './OrderDetails.module.scss';

const OrderDetails = () => {
  const number = useAppSelector(
    (state: ReducersParams) => {
      return state.order.number
    }
  );

  return (
    <div className={`${orderDetailsStyles.root} mt-30 mb-30`}>
      <h2 className={`${orderDetailsStyles.orderNumber} text text_type_digits-large mb-8`}>{number}</h2>
      <p className={`${orderDetailsStyles.text} text text_type_main-medium`}>идентификатор заказа</p>
      <img className={`${orderDetailsStyles.done} mt-15 mb-15`} alt={'Успешно'} src={done}/>
      <p className={`${orderDetailsStyles.text} text text_type_main-default mb-2`}>Ваш заказ начали готовить</p>
      <p className={`${orderDetailsStyles.text} text text_type_main-default text_color_inactive`}>Дождитесь готовности
        на орбитальной станции</p>
    </div>
  );
}

export default OrderDetails;
