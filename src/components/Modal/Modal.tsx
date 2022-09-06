import * as React from 'react';
import ReactDOM from 'react-dom';
import {useHistory, useLocation} from 'react-router-dom';

import {CloseIcon} from '@ya.praktikum/react-developer-burger-ui-components';

import ModalOverlay from '../ModalOverlay/ModalOverlay';

import {TLocation} from '../../utils/types';
import {useAppDispatch, useAppSelector} from '../../services/store';
import {modalSlice} from '../../services/slices/modal';
import {burgerConstructorSlice} from '../../services/slices/burgerConstructor';

import modalStyles from './Modal.module.scss';

const Modal: React.FC = ({children}) => {
  const dispatch = useAppDispatch();
  const history = useHistory<History>();
  const location = useLocation<TLocation>();

  const modalRoot = document.getElementById('modals') as HTMLElement;
  const {modalType} = useAppSelector((state) => {
    return state.modal;
  });
  const [show, setShow] = React.useState<boolean>(false);

  const handleEscClose = (evt: KeyboardEvent): void => {
    if (evt.code === 'Escape') {
      closeModal();
    }
  }

  const handleCloseModal = (evt: React.SyntheticEvent): void => {
    const target = evt.target as HTMLElement;
    if (target.classList.contains(modalStyles.root_opened)) {
      closeModal();
    }
    evt.stopPropagation();
  }

  const closeModal = (): void => {
    setShow(false);
  }

  const closeAfterTransitionEnd = React.useCallback((): void => {
    dispatch(modalSlice.actions.closeModal());
    if (modalType === 'orderDetails') {
      dispatch(burgerConstructorSlice.actions.clearAll());
    }
    if (location.state?.background) {
      history.replace({pathname: location.state.background.pathname});
    } else {
      history.replace({pathname: '/'});
    }

  }, [dispatch, history, modalType, location]);

  React.useEffect((): () => void => {
    setShow(true);
    document.addEventListener('keydown', handleEscClose);

    return () => {
      document.removeEventListener('keydown', handleEscClose);
    }
  }, []);

  return ReactDOM.createPortal((
      <ModalOverlay show={show}>
        <div className={`${modalStyles.root} ${show && modalStyles.root_opened}`} onClick={handleCloseModal}
             onTransitionEnd={!show ? (): void => {
               closeAfterTransitionEnd();
             } : undefined}>
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

export default Modal;
