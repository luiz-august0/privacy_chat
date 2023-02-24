import React from 'react';
import * as Font from 'expo-font';
import Routes from './routes';
import { Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import {name as appName} from './app.json';
import storeConfig from './src/store/storeConfig';

let customFonts = {
    'Montserrat-Bold': require('./src/assets/fonts/Montserrat-Bold.ttf')
};

const store = storeConfig();

export default class Redux extends React.Component {

    state = {
        fontsLoaded: false,
    };

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    render() {
        if (!this.state.fontsLoaded) {
        return null;
        }

        return (
            <Provider store={store}>
                <Routes/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent(appName, () => Redux);