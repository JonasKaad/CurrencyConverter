/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Homescreen from './homescreen';
import {name as appName} from './app.json';

import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from './app/store';

//AppRegistry.registerComponent(appName, () => homescreen);
//AppRegistry.registerComponent(appName, () => ExchangeFromScreen);
/*
const RNRedux = () => (
  <Provider store={store}>
    <Homescreen />
  </Provider>
);*/

AppRegistry.registerComponent(appName, () => Homescreen);
