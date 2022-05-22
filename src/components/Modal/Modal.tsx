import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {CloseIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import ModalOverlay from '../ModalOverlay/ModalOverlay';

import modalStyles from './Modal.module.scss';

interface ModalProps {
  children: React.ReactElement,
  onClose: React.TransitionEventHandler<HTMLDivElement>
}

const Modal = ({children, onClose}: ModalProps) => {
  const modalRoot = document.getElementById('modals') as HTMLElement;
  const [show, setShow] = React.useState(false);

  const handleEscClose = (evt: KeyboardEvent) => {
    if (evt.code === 'Escape') {
      closeModal();
    }
  }

  const handleCloseModal = (evt: React.SyntheticEvent) => {
    const target = evt.target as HTMLElement;
    if (target.classList.contains(modalStyles.root_opened)) {
      closeModal();
    }
    evt.stopPropagation();
  }

  const closeModal = () => {
    setShow(false);
  }

  React.useEffect(() => {
    setShow(true);
    document.addEventListener('keydown', handleEscClose);

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    }
  }, []);

  return ReactDOM.createPortal((
      <ModalOverlay show={show}>
        <div className={`${modalStyles.root} ${show && modalStyles.root_opened}`} onClick={handleCloseModal}
             onTransitionEnd={!show ? onClose : undefined}>
          <div className={modalStyles.wrapper}>
            <div className={modalStyles.closeButton} onClick={closeModal}>
              <CloseIcon type='primary'/>
            </div>
            {children}
          </div>
        </div>
      </ModalOverlay>
    ),
    modalRoot
  );
}

Modal.propTypes = {
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default Modal;
