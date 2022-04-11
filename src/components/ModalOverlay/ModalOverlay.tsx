import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Modal from '../Modal/Modal';

import modalOverlayStyles from './ModalOverlay.module.css';

const ModalOverlay = ({type, data, onClose}) => {
  const modalRoot = document.getElementById('modals') as HTMLElement;
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
    document.addEventListener('keydown', handleEscClose);
  }, []);

  const handleEscClose = (evt) => {
    if (evt.code === 'Escape') {
      closeModal();
    }
  }

  const handleCloseModal = (evt) => {
    if (evt.target.classList.contains(modalOverlayStyles.root_opened)) {
      closeModal();
    }
    evt.stopPropagation();
  }

  const closeModal = () => {
    setShow(false);
    document.removeEventListener('keydown', handleEscClose);
  }

  return ReactDOM.createPortal((
      <div className={`${modalOverlayStyles.root} ${show && modalOverlayStyles.root_opened}`} onClick={handleCloseModal}
           onTransitionEnd={!show ? onClose : null}>
        <Modal onClose={closeModal} type={type}>{data}</Modal>
      </div>
    ), modalRoot
  );
}

ModalOverlay.propTypes = {
  type: PropTypes.string,
  data: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

export default ModalOverlay;
