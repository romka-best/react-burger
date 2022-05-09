import spinnerStyles from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className={spinnerStyles.root}>
      <div className={spinnerStyles.circle}>
        <div className={spinnerStyles.circleGradient}/>
        <div className={spinnerStyles.circleInner}/>
      </div>
    </div>
  );
}

export default Spinner;
