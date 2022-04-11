import React from 'react';

import errorBoundaryStyles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch(error, info) {
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