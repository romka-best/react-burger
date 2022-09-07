import * as React from 'react';

import customErrorStyles from './CustomError.module.scss';

interface ICustomError {
  textError: string
}

const CustomError: React.FC<ICustomError> = ({textError}: ICustomError) => {
  return (
    <div className={customErrorStyles.root}>
      <h1 className={`${customErrorStyles.title} text text_type_main-large`}>В приложении возникла ошибка 😔</h1>
      <p className={`${customErrorStyles.description} text text_type_main-medium`}>{textError}</p>
    </div>
  );
}

export default CustomError;
