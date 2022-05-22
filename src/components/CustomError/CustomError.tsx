import PropTypes from 'prop-types';

import customErrorStyles from './CustomError.module.scss';

interface CustomErrorProps {
  textError: string
}

const CustomError = ({textError}: CustomErrorProps) => {
  return (
    <div className={customErrorStyles.root}>
      <h1 className={`${customErrorStyles.title} text text_type_main-large`}>В приложении возникла ошибка 😔</h1>
      <p className={`${customErrorStyles.description} text text_type_main-medium`}>{textError}</p>
    </div>
  );
}

CustomError.propTypes = {
  textError: PropTypes.string.isRequired,
}

export default CustomError;
