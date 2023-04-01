import * as React from 'react';
import {useState, useEffect} from 'react';
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
const currencyNames = require('./data/currencies.json');
const salesTaxes = require('./data/sales-tax.json');
//let salesTax: boolean = false;

function calculateConversion(
  inputValue: number,
  salesTax: boolean,
  stateTax: string,
) {
  let calc = inputValue * 6.85;
  if (salesTax) {
    calc = calc * (1 + salesTaxes[stateTax].rate);
  }
  return parseFloat(calc.toFixed(2));
}
const storeData = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@Exchange', jsonValue);
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

export function ReactNativeNumberFormat({value}) {
  return (
    <NumericFormat
      value={value}
      displayType={'text'}
      thousandSeparator={true}
      color="#fff"
      prefix={''}
      renderText={formattedValue => (
        <Text style={styles.inputText}>{formattedValue}</Text>
      )} // <--- Don't forget this!
    />
  );
}
function HomeScreen({navigation}) {
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

  function updateTimeString(s) {
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
      //console.log(responseJson);
      storeData(responseJson);

      let s = responseJson.lastupdate;
      setUpdated(updateTimeString(s));
    } catch (error) {
      console.error(error);
    }
  }

  function resetTextInput() {
    console.log('reset TextInput');
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

  function checkValueIsNull(): boolean {
    if (value == null) {
      return true;
    } else return false;
  }

  return (
    <View style={styles.backgroundStyle}>
      <TextInput
        style={styles.inputText}
        onChangeText={number => onChangeNumber(number.replace(/[^0-9.]/g, ''))}
        value={number}
        placeholder="Start typing..."
        placeholderTextColor="#b9b9b9"
        keyboardType="numeric"
      />
      <TouchableOpacity
        onPress={() => {
          resetTextInput();
        }}>
        <Text style={styles.text}>Reset</Text>
      </TouchableOpacity>
      <ReactNativeNumberFormat
        value={calculateConversion(number, salesTax, value).toString()}
      />

      <View style={styles.container}>
        <View style={[{width: '25%', margin: 10}]}>
          <Text style={styles.text}>Exchange From:</Text>
          <Button
            color="#362B21"
            title="USD"
            onPress={() => navigation.navigate('ExchangeFrom')}
          />
        </View>

        <View style={[{margin: 8}]}>
          <Text></Text>
          <TouchableOpacity style={styles.exchangeStyle}>
            <Icon name="swap-horiz" color={'#fff'} size={34} />
          </TouchableOpacity>
        </View>
        <View style={[{width: '25%', margin: 10}]}>
          <Text style={styles.text}>Exchange To:</Text>
          <Button
            color="#362B21"
            title="DKK"
            onPress={() => navigation.navigate('ExchangeTo')}
          />
        </View>
      </View>
      <View style={styles.taxStyle}>
        <BouncyCheckbox
          size={30}
          fillColor="#362B21"
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
          dropDownDirection="BOTTOM"
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
            color="#362B21"
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

type ItemProps = {
  cur: string;
  name: string;
  newname: string;
};

/*
Object.keys(currencyNames).forEach(function (key) {
  DATA.push({id: key, cur: key, name: currencyNames[key]});
});*/

const Item = ({name, cur}: ItemProps) => (
  <View>
    <View style={styles.item}>
      <Text style={styles.title}>{cur + ' - ' + name}</Text>
    </View>
  </View>
);
function ExchangeFromScreen(this: any, {navigation}) {
  let DATA = [];

  async function loadData() {
    try {
      let exNames = await getData();
      if (exNames != null && exNames.rates != undefined) {
        Object.keys(exNames.rates).forEach(function (key) {
          DATA.push({id: key, cur: key, name: currencyNames[key]});
        });
      } else {
        DATA.push({
          id: 'no_rates',
          cur: 'No rates found',
          name: 'go fetch some!',
        });
      }
    } catch (e) {
      console.error(e);
    }

    /*
    Object.keys(currencyNames).forEach(function (key) {
      DATA.push({id: key, rcur: key, name: currencyNames[key]});
    });*/
  }
  loadData();

  return (
    <FlatList
      data={DATA}
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
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

function ExchangeToScreen({navigation}) {
  return (
    <View style={styles.backgroundStyle}>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('HomeScreen')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#362B21',
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

StatusBar.setBackgroundColor('#362B21');
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
});

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
