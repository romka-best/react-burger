import React from 'react';

import {mockData} from '../../utils/data';

import AppHeader from '../AppHeader/AppHeader';
import Main from '../Main/Main';

import appStyles from './App.module.css';

function App() {
  const [state, setState] = React.useState({
    currentPage: "Конструктор"
  });

  return (
    <div className={appStyles.root}>
      <AppHeader state={state}/>
      <Main state={state} data={mockData}/>
    </div>
  );
}

export default App;
