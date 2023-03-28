/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import homescreen from './homescreen';
import ExchangeFromScreen from './screens/ExchangeFromScreen';
import {name as appName} from './app.json';

//AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => homescreen);
//AppRegistry.registerComponent(appName, () => ExchangeFromScreen);
