# Currency Converter - An app for converting currencies

![](./readme-assets/icon.png)

A persistent app for converting currencies, made in React Native.

<img src="./readme-assets/conversion.jpg" alt="Conversion example" style="zoom: 30%;" />

## Features

The app is made with React Native and utilizes [Redux](https://redux.js.org/) to manage the state of the app, to ensure it that everything works and transfers between different screens. This is stored locally using [Async Storage](https://react-native-async-storage.github.io/async-storage/), to ensure that the app stays persistent and that the last used currencies are loaded in on launch.

The app is able to work entirely offline, after data containing the rates have been loaded in *once*. The rates will also be store locally and can of course be updated by fetching the [API](https://forexvalutaomregner.dk/pages/api), whenever the user wants.

### Currencies supported

Over **180+ currencies** supported, including cryptocurrencies! Using the [API](https://forexvalutaomregner.dk/pages/api) from [ForexValutaOmregner](forexvalutaomregner.dk), to fetch the rates for the different currencies.

<img src="./readme-assets/currencies.jpg" alt="List of Currencies" style="zoom: 30%;" />

### Sales taxes

It is possible to add on the sales tax of any state in the US that has one. 

<img src="./readme-assets/statetaxes.jpg" alt="Dropdown overview of state taxes" style="zoom: 30%;" />

