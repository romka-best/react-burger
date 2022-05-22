import React, {ErrorInfo} from 'react';

import errorBoundaryStyles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {

}

export default class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: string) {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.log("Возникла ошибка!", error, info);
  }

  render() {
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