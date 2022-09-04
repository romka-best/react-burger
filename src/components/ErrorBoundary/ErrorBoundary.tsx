import * as React from 'react';

import {TErrorBoundaryState} from './ErrorBoundaryTypes';
import errorBoundaryStyles from './ErrorBoundary.module.scss';

interface IErrorBoundary {

}

export default class ErrorBoundary extends React.Component<IErrorBoundary, TErrorBoundaryState> {
  constructor(props: IErrorBoundary) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: string) {
    console.log('Поймали ошибку:', error);
    return {hasError: true};
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log('Возникла ошибка!', error, info);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className={errorBoundaryStyles.root}>
          <h1 className={`${errorBoundaryStyles.title} text text_type_main-large`}>Что-то пошло не так 😢</h1>
          <p className={`${errorBoundaryStyles.description} text text_type_main-medium`}>
            В приложении произошла ошибка. Пожалуйста, перезагрузите страницу.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}