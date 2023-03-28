import * as React from 'react';
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
import type {PropsWithChildren} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
//let salesTax: boolean = false;

function calculateConversion(inputValue: number, salesTax: boolean) {
  let calc = inputValue * 7.45;
  if (salesTax) {
    calc = calc * 1.065;
  }
  return parseFloat(calc.toFixed(2));
}

//function addSalesTax(bool: boolean) {
//  salesTax = bool;
//}

import {NumericFormat} from 'react-number-format';

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
  const [number, onChangeNumber] = React.useState('');
  const [salesTax, setSalesTax] = React.useState(false);
  const {exFrom} = React.useContext{GlobalContext}

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([
    {label: 'Maryland - 6%', value: 'ma'},
    {label: 'Washington - 6.5%', value: 'wa'},
    {label: 'North Carolina - 5.75%', value: 'nc'},
    {label: 'EWashington - 3.5%', value: 'waaa'},
    {label: 'EE Carolina - 1.75%', value: 'ncaa'},
    {label: 'AAWashington - 6.5%', value: 'wqa'},
    {label: 'AANorth Carolina - 5.75%', value: 'nqc'},
    {label: 'Washington - 6.5%', value: 'wea'},
    {label: 'North Carolina - 5.75%', value: 'nec'},
    {label: 'Washington - 6.5%', value: 'wda'},
    {label: 'North Carolina - 5.75%', value: 'ncd'},
    {label: 'Washington - 6.5%', value: 'wsa'},
    {label: 'North Carolina - 5.75%', value: 'nsc'},
    {label: 'Washington - 6.5%', value: 'wca'},
    {label: 'North Carolina - 5.75%', value: 'ncc'},
    {label: 'Washington - 6.5%', value: 'wav'},
    {label: 'North Carolina - 5.75%', value: 'ncv'},
    {label: 'Washington - 6.5%', value: 'wsxa'},
    {label: 'North Carolina - 5.75%', value: 'nsxc'},
    {label: 'Washington - 6.5%', value: 'waca'},
    {label: 'North Carolina - 5.75%', value: 'nacc'},
    {label: 'Washington - 6.5%', value: 'wzav'},
    {label: 'North Carolina - 5.75%', value: 'nzcv'},
    {label: 'Washington - 6.5%', value: 'wgsa'},
    {label: 'North Carolina - 5.75%', value: 'ngsc'},
    {label: 'Washington - 6.5%', value: 'wcja'},
    {label: 'North Carolina - 5.75%', value: 'ncjc'},
    {label: 'Washington - 6.5%', value: 'wlav'},
    {label: 'North Carolina - 5.75%', value: 'nclv'},
  ]);

  function resetTextInput() {
    console.log('reset TextInput');
    onChangeNumber('');
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
        value={calculateConversion(number, salesTax).toString()}
      />

      <View style={styles.container}>
        <View style={[{width: '25%', margin: 10}]}>
          <Text style={styles.text}>Exchange From:</Text>
          <Button
            color="#362B21"
            title="EUR"
            onPress={() => navigation.navigate('ExchangeFrom')}
          />
        </View>

        <View style={[{margin: 8}]}>
          <Text></Text>
          <TouchableOpacity
            onPress={console.log('hey')}
            style={styles.exchangeStyle}>
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
          text="Add sales tax"
          iconStyle={{borderColor: 'blue'}}
          innerIconStyle={{borderWidth: 2}}
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
            <Text style={styles.text}>Last updated: 28-03-2023</Text>
          </View>
          <Button
            color="#362B21"
            title="Update rates"
            onPress={() => console.log('Updated!')}
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

const DATA = [
  {
    id: 'USD',
    cur: 'USD',
    name: 'United States Dollar',
  },
  {
    id: 'AFN',
    cur: 'AFN',
    name: 'Afghan Afghani',
  },
  {
    id: 'DKK',
    cur: 'DKK',
    name: 'Danish Krone',
  },
  {
    id: 'BAM',
    cur: 'BAM',
    name: 'Bosnia-Herzegovina Convertible Mark',
  },
];

const Item = ({name, cur}: ItemProps) => (
  <View>
    <View style={styles.item}>
      <Text style={styles.title}>{cur + ' - ' + name}</Text>
    </View>
  </View>
);
function ExchangeFromScreen(this: any, {navigation}) {
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
