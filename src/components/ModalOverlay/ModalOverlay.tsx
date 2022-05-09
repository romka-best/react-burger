import PropTypes from 'prop-types';

import modalOverlayStyles from './ModalOverlay.module.css';

const ModalOverlay = ({children, show}) => {
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
