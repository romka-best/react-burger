import React from 'react';
import PropTypes from 'prop-types';

import {CloseIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import OrderDetails from '../OrderDetails/OrderDetails';
import IngredientDetails from '../IngredientDetails/IngredientDetails';

import modalStyles from './Modal.module.css';

const Modal = ({onClose, type, children}) => {
  return (
    <div className={modalStyles.root}>
      <div className={modalStyles.closeButton} onClick={onClose}>
        <CloseIcon type='primary' />
      </div>
      {type === 'orderDetails' && <OrderDetails/>}
      {type === 'ingredientDetails' && <IngredientDetails ingredientDetails={children}/>}
    </div>
  );
}

Modal.propTypes = {
  type: PropTypes.string,
  children: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

export default Modal;
