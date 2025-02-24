import React from 'react';
import './global.css';
import {Provider} from 'react-redux';
import {store} from './services/store';
import i18n from './services/translationService';
import RootLayout from './layout';


const App = () => {
  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  );
};

export default App;
