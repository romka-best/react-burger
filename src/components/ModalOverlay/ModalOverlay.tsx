import * as React from 'react';

import modalOverlayStyles from './ModalOverlay.module.scss';

interface IModalOverlay {
  children: React.ReactElement,
  show: boolean
}

const ModalOverlay: React.FC<IModalOverlay> = ({children, show}: IModalOverlay) => {
  return (
    <div className={`${modalOverlayStyles.root} ${show ? modalOverlayStyles.root_opened : ''}`}>
      {children}
    </div>
  );
}

export default ModalOverlay;
