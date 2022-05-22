import React from 'react';
import PropTypes from 'prop-types';

import modalOverlayStyles from './ModalOverlay.module.scss';

interface ModalOverlayProps {
  children: React.ReactElement,
  show: boolean
}

const ModalOverlay = ({children, show}: ModalOverlayProps) => {
  return (
    <div className={`${modalOverlayStyles.root} ${show && modalOverlayStyles.root_opened}`}>
      {children}
    </div>
  );
}

ModalOverlay.propTypes = {
  children: PropTypes.element.isRequired,
  show: PropTypes.bool.isRequired
}

export default ModalOverlay;
