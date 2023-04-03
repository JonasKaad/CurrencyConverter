import * as React from 'react';
import {useState, useEffect, PureComponent, memo} from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  useColorScheme,
  TouchableHighlight,
  FlatList,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NumericFormat} from 'react-number-format';
import Item from './Item';
import {createSlice, configureStore} from '@reduxjs/toolkit';
import filter from 'lodash.filter';
const currencyNames = require('./data/currencies.json');
const salesTaxes = require('./data/sales-tax.json');

const exchangeFromCurrencySlice = createSlice({
  name: 'exchangeFromCurrency',
  initialState: {
    value: ' ',
  },
  reducers: {
    setExchangeFromText: (state, action) => {
      state.value = action.payload;
    },
  },
});

const exchangeToCurrencySlice = createSlice({
  name: 'exchangeToCurrency',
  initialState: {
    value: ' ',
  },
  reducers: {
    setExchangeToText: (state, action) => {
      state.value = action.payload;
    },
  },
});

const exchangeFromRateSlice = createSlice({
  name: 'exchangeFromRate',
  initialState: {
    value: 0,
  },
  reducers: {
    setExchangeFromRate: (state, action) => {
      state.value = action.payload;
    },
  },
});

const exchangeToRateSlice = createSlice({
  name: 'exchangeToRate',
  initialState: {
    value: 0,
  },
  reducers: {
    setExchangeToRate: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {setExchangeFromText} = exchangeFromCurrencySlice.actions;
export const {setExchangeFromRate} = exchangeFromRateSlice.actions;
export const {setExchangeToText} = exchangeToCurrencySlice.actions;
export const {setExchangeToRate} = exchangeToRateSlice.actions;

const rateFromStore = configureStore({
  reducer: exchangeFromRateSlice.reducer,
});

const currencyFromStore = configureStore({
  reducer: exchangeFromCurrencySlice.reducer,
});

const rateToStore = configureStore({
  reducer: exchangeToRateSlice.reducer,
});

const currencyToStore = configureStore({
  reducer: exchangeToCurrencySlice.reducer,
});

export const dispatchExchangeFromRate = (amount: any) => (dispatch: any) => {
  setTimeout(() => {
    dispatch(setExchangeFromRate(amount));
  }, 100);
};

export const dispatchExchangeFromText = (amount: any) => (dispatch: any) => {
  setTimeout(() => {
    dispatch(setExchangeFromText(amount));
  }, 100);
};

export const dispatchExchangeToRate = (amount: any) => (dispatch: any) => {
  setTimeout(() => {
    dispatch(setExchangeToRate(amount));
  }, 100);
};

export const dispatchExchangeToText = (amount: any) => (dispatch: any) => {
  setTimeout(() => {
    dispatch(setExchangeToText(amount));
  }, 100);
};

const storeData = async (value: any, key: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@Exchange');
    const parsed = JSON.parse(jsonValue);
    return parsed;
  } catch (e) {}
};

function calculateConversion(
  inputValue: number,
  salesTax: boolean,
  stateTax: string,
  fromRate: number,
  toRate: number,
) {
  if (inputValue.toString() != '') {
    let calc = inputValue * (toRate / fromRate);
    if (salesTax) {
      calc = calc * (1 + salesTaxes[stateTax].rate);
    }
    return parseFloat(calc.toFixed(2));
  } else return '';
}

export function ReactNativeNumberFormat({value}: any) {
  return (
    <NumericFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      color="#fff"
      prefix={''}
      renderText={formattedValue => (
        <Text style={styles.inputText}>{formattedValue}</Text>
      )}
    />
  );
}
function HomeScreen({navigation}: any) {
  const [number, onChangeNumber] = useState('');
  const [salesTax, setSalesTax] = useState(false);

  const [lastUpdated, setUpdated] = useState('');
  let TAXES = [];

  Object.keys(salesTaxes).forEach(function (key) {
    TAXES.push({
      id: key,
      label: key + ' - ' + (salesTaxes[key].rate * 100).toFixed(2) + '%',
      value: key,
      rate: salesTaxes[key].rate,
    });
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(TAXES);
  const [exFromCurrency, setExFromCurrency] = useState('');
  const [exToCurrency, setExToCurrency] = useState('');
  const [exFromRate, setExFromRate] = useState(0);
  const [exToRate, setExToRate] = useState(0);

  currencyFromStore.subscribe(() =>
    setExFromCurrency(currencyFromStore.getState().value),
  );
  currencyToStore.subscribe(() =>
    setExToCurrency(currencyToStore.getState().value),
  );
  rateFromStore.subscribe(() => setExFromRate(rateFromStore.getState().value));
  rateToStore.subscribe(() => setExToRate(rateToStore.getState().value));
  function updateTimeString(s: string) {
    s =
      'Last updated: ' +
      s.substring(8, 10) +
      s.substring(4, 8) +
      s.substring(0, 4);
    return s;
  }

  async function updateRates() {
    try {
      const url = 'https://cdn.forexvalutaomregner.dk/api/latest.json';
      let response = await fetch(url);
      let responseJson = await response.json();
      storeData(responseJson, '@Exchange');

      let s = responseJson.lastupdate;
      setUpdated(updateTimeString(s));
    } catch (error) {
      console.error(error);
    }
  }

  function resetTextInput() {
    onChangeNumber('');
  }

  useEffect(setRatesUpdatedString, []);

  function setRatesUpdatedString() {
    try {
      AsyncStorage.getItem('@Exchange').then(value => {
        const parsed = JSON.parse(value);
        if (value != null && !parsed.lastupdate != undefined) {
          setUpdated(updateTimeString(parsed.lastupdate));
        } else {
          setUpdated('No rates found. Fetch now:');
        }
      });
    } catch (e) {
      console.error('Error with getting updated timestamp.' + e);
    }
  }

  useEffect(fetchLastUsed, []);

  function fetchLastUsed() {
    try {
      AsyncStorage.getItem('@ExchangeFrom').then(value => {
        if (value != null) {
          setExFromCurrency(value.replaceAll('"', ''));
        } else {
          setExFromCurrency('NONE');
        }
      });
      AsyncStorage.getItem('@ExchangeFromRate').then(value => {
        if (value != null) {
          setExFromRate(value.replaceAll('"', ''));
        } else {
          setExFromRate(0);
        }
      });
    } catch (e) {
      console.error('Error with getting updated timestamp.' + e);
    }
    try {
      AsyncStorage.getItem('@ExchangeTo').then(value => {
        if (value != null) {
          setExToCurrency(value.replaceAll('"', ''));
        } else {
          setExToCurrency('NONE');
        }
      });
      AsyncStorage.getItem('@ExchangeToRate').then(value => {
        if (value != null) {
          setExToRate(value.replaceAll('"', ''));
        } else {
          setExToRate(0);
        }
      });
    } catch (e) {
      console.error('Error with getting updated timestamp.' + e);
    }
    try {
      AsyncStorage.getItem('@StateTax').then(value => {
        if (value != null) {
          setValue(value.replaceAll('"', ''));
        } else {
          setValue(null);
        }
      });
    } catch (e) {
      console.error('Error with getting updated timestamp.' + e);
    }
  }

  function checkValueIsNull(): boolean {
    if (value == null) {
      return true;
    } else return false;
  }

  function swapCurrency() {
    function storeExchangeFrom(data: string) {
      storeData(data, '@ExchangeFrom');
    }
    function storeExchangeFromRate(data: string) {
      storeData(data, '@ExchangeFromRate');
    }
    function storeExchangeTo(data: string) {
      storeData(data, '@ExchangeTo');
    }
    function storeExchangeToRate(data: string) {
      storeData(data, '@ExchangeToRate');
    }

    let tempExFromRate = exFromRate;
    let tempExFromCurr = exFromCurrency;
    let tempExToRate = exToRate;
    let tempExToCurr = exToCurrency;
    setSalesTax(false);

    rateFromStore.dispatch(dispatchExchangeFromRate(tempExToRate));
    currencyFromStore.dispatch(dispatchExchangeFromText(tempExToCurr));
    rateToStore.dispatch(dispatchExchangeToRate(tempExFromRate));
    currencyToStore.dispatch(dispatchExchangeToText(tempExFromCurr));
    storeExchangeFrom(tempExToCurr);
    storeExchangeFromRate(tempExToRate);
    storeExchangeTo(tempExFromCurr);
    storeExchangeToRate(tempExFromRate);
  }

  function dropDownFunc(value: string) {
    function storeStateTax(data: string) {
      storeData(data, '@StateTax');
    }

    storeStateTax(value);
  }

  return (
    <View style={styles.backgroundStyle}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.inputStyle}
          onChangeText={number =>
            onChangeNumber(number.replace(/[^0-9.]/g, ''))
          }
          value={number}
          placeholder="Start typing..."
          placeholderTextColor="#b9b9b9"
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={() => {
            resetTextInput();
          }}>
          <Icon style={styles.clearIcon} name="cancel" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      <ReactNativeNumberFormat
        value={calculateConversion(
          number,
          salesTax,
          value,
          exFromRate,
          exToRate,
        ).toString()}
      />
      <View style={styles.container}>
        <View style={[{width: '25%', margin: 10}]}>
          <Text style={styles.text}>Exchange From:</Text>
          <Button
            color="#a14e00"
            title={exFromCurrency}
            onPress={() => navigation.navigate('ExchangeFrom')}
          />
        </View>

        <View style={[{margin: 8}]}>
          <Text></Text>
          <TouchableOpacity style={styles.exchangeStyle} onPress={swapCurrency}>
            <Icon name="swap-horiz" color={'#fff'} size={34} />
          </TouchableOpacity>
        </View>
        <View style={[{width: '25%', margin: 10}]}>
          <Text style={styles.text}>Exchange To:</Text>
          <Button
            color="#a14e00"
            title={exToCurrency}
            onPress={() => navigation.navigate('ExchangeTo')}
          />
        </View>
      </View>

      <View style={styles.taxStyle}>
        <BouncyCheckbox
          size={30}
          fillColor="#a14e00"
          unfillColor="#FFFFFF"
          text={checkValueIsNull() ? 'Choose state below' : 'Add sales tax'}
          iconStyle={{borderColor: 'blue'}}
          innerIconStyle={{borderWidth: 2}}
          disabled={checkValueIsNull()}
          textStyle={{
            fontFamily: 'JosefinSans-Regular',
            textDecorationLine: 'none',
            color: '#fff',
            fontSize: 18,
          }}
          onPress={(isChecked: boolean) => {
            setSalesTax(isChecked);
          }}
        />
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={value => {
            dropDownFunc(value);
          }}
          dropDownDirection="BOTTOM"
          labelStyle={{
            fontWeight: 'bold',
            color: '#fff',
          }}
          listItemLabelStyle={{
            color: '#fff',
          }}
          selectedItemContainerStyle={{
            backgroundColor: '#683200',
          }}
          selectedItemLabelStyle={{
            fontWeight: 'bold',
          }}
          containerStyle={{
            width: '60%',
            marginTop: 10,
            marginBottom: 160,
          }}
        />
      </View>
      <View style={styles.ratesStyle}>
        <View style={[{width: '45%'}]}>
          <View style={styles.taxStyle}>
            <Text style={styles.text}>{lastUpdated}</Text>
          </View>
          <Button
            color="#a14e00"
            title="Update rates"
            onPress={() => updateRates()}
          />
        </View>
      </View>
    </View>
  );
}
export function ExchangeButton(name: string, navigationDestination: string) {
  const navigation = useNavigation();

  return (
    <View style={[{width: '25%', margin: 10}]}>
      <Text style={styles.text}>Exchange From:</Text>
      <Button
        title={name}
        onPress={() => navigation.navigate(navigationDestination)}
      />
    </View>
  );
}

function ExchangeFromScreen(this: any, {navigation}: any) {
  let DATA = [];

  async function loadData() {
    try {
      let exNames = await getData();
      if (exNames != null && exNames.rates != undefined) {
        Object.keys(exNames.rates).forEach(function (key) {
          DATA.push({
            id: key,
            cur: key,
            rate: exNames.rates[key],
            name: currencyNames[key],
          });
        });
      } else {
        DATA.push({
          id: 'no_rates',
          cur: 'No rates found',
          rate: '',
          name: 'go fetch some!',
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
  loadData();

  function storeExchangeFrom(data: string) {
    storeData(data, '@ExchangeFrom');
  }
  function storeExchangeFromRate(data: string) {
    storeData(data, '@ExchangeFromRate');
  }
  const [data, setData] = useState(DATA);
  const [fullData, setFullData] = useState(DATA);
  const [query, setQuery] = useState('');

  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(fullData, user => {
      return contains(user, formattedQuery);
    });
    setData(filteredData);
    setQuery(text);
  };

  const contains = ({name, id}, query) => {
    if (
      name.toLowerCase().includes(query) ||
      id.toLowerCase().includes(query)
    ) {
      return true;
    }

    return false;
  };

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <View
            style={{
              padding: 10,
              marginVertical: 10,
              borderRadius: 20,
            }}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              value={query}
              onChangeText={queryText => handleSearch(queryText)}
              placeholder="Search"
              placeholderTextColor="#dadada"
              style={{
                backgroundColor: '#683200',
                paddingHorizontal: 20,
                fontSize: 20,
                color: '#fff',
              }}
            />
          </View>
        </>
      }
      data={data}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => {
            storeExchangeFrom(item.id);
            storeExchangeFromRate(item.rate);
            rateFromStore.dispatch(dispatchExchangeFromRate(item.rate));
            currencyFromStore.dispatch(dispatchExchangeFromText(item.id));
            navigation.navigate('HomeScreen');
          }}>
          <View>
            <Item name={item.name} cur={item.cur} />
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      style={styles.flatListStyle}
    />
  );
}

function ExchangeToScreen(this: any, {navigation}: any) {
  let DATA = [];

  async function loadData() {
    try {
      let exNames = await getData();
      if (exNames != null && exNames.rates != undefined) {
        Object.keys(exNames.rates).forEach(function (key) {
          DATA.push({
            id: key,
            cur: key,
            rate: exNames.rates[key],
            name: currencyNames[key],
          });
        });
      } else {
        DATA.push({
          id: 'no_rates',
          cur: 'No rates found',
          rate: '',
          name: 'go fetch some!',
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
  loadData();

  function storeExchangeTo(data: string) {
    storeData(data, '@ExchangeTo');
  }
  function storeExchangeToRate(data: string) {
    storeData(data, '@ExchangeToRate');
  }

  const [data, setData] = useState(DATA);
  const [fullData, setFullData] = useState(DATA);
  const [query, setQuery] = useState('');

  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(fullData, user => {
      return contains(user, formattedQuery);
    });
    setData(filteredData);
    setQuery(text);
  };

  const contains = ({name, id}, query) => {
    if (
      name.toLowerCase().includes(query) ||
      id.toLowerCase().includes(query)
    ) {
      return true;
    }

    return false;
  };

  function renderHeader() {
    return (
      <View
        style={{
          padding: 10,
          marginVertical: 10,
          borderRadius: 20,
        }}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value={query}
          onChangeText={queryText => handleSearch(queryText)}
          placeholder="Search"
          placeholderTextColor="#dadada"
          style={{
            backgroundColor: '#683200',
            paddingHorizontal: 20,
            color: '#fff',
          }}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      ListHeaderComponent={renderHeader}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => {
            storeExchangeTo(item.id);
            storeExchangeToRate(item.rate);
            rateToStore.dispatch(dispatchExchangeToRate(item.rate));
            currencyToStore.dispatch(dispatchExchangeToText(item.id));
            navigation.navigate('HomeScreen');
          }}>
          <View>
            <Item name={item.name} cur={item.cur} />
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      style={styles.flatListStyle}
    />
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#a14e00',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="HomeScreen"
        options={{title: 'Currency Converter'}}
        component={HomeScreen}
      />
      <Stack.Screen
        name="ExchangeFrom"
        options={{title: 'Exchange from'}}
        component={ExchangeFromScreen}
      />
      <Stack.Screen
        name="ExchangeTo"
        options={{title: 'Exchange to'}}
        component={ExchangeToScreen}
      />
    </Stack.Navigator>
  );
}

const myTheme = require('./themes/theme');

DropDownPicker.addTheme('MyThemeName', myTheme);
DropDownPicker.setTheme('MyThemeName');
DropDownPicker.setListMode('SCROLLVIEW'); //can be changed to MODAL

StatusBar.setBackgroundColor('#a14e00');
const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  exchangeButtonsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  flatListStyle: {
    backgroundColor: '#1E1E1E',
  },
  exchangeStyle: {
    margin: 10,
  },
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  taxStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratesStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  item: {
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    color: '#fff',
  },
  input: {
    height: '20%',
    width: '80%',
    margin: 12,
    marginLeft: 10,
    borderWidth: 1,
    padding: 10,
  },
  inputText: {
    color: '#fff',
    fontSize: 26,
    margin: 12,
    padding: 10,
  },
  text: {
    color: '#fff',
  },
  clearIcon: {
    paddingTop: 28,
    paddingRight: 20,
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  inputStyle: {
    color: '#fff',
    fontSize: 26,
    flex: 1,
    margin: 12,
    padding: 10,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
