/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SignInScreen from './src/SignInScreen.js';
import ChatListScreen from './src/ChatListScreen.js';
import ChatScreen from './src/ChatScreen.js';




const Stack = createStackNavigator();


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginData: null,
    };
  }

  async componentDidUpdate() {
    console.log('componentDidUpdate');
    let loginData = await AsyncStorage.getItem('loginData');
    if (loginData != null) {
      let parsed = JSON.parse(loginData);
      console.log('Login Data ; ',parsed)
      this.setState({
        loginData: parsed,
      });
    }

  }


  render() {
    return (
      <>
          <NavigationContainer>
            <StatusBar barStyle='light-content' />
            {/* <SafeAreaView style={{ flex: 1 }}> */}
              <Stack.Navigator
                initialRouteName={this.state.isLoging ? 'Chat' : 'Sign In'}
                screenOptions={{
                  headerShown: false
                }}
              >
                <Stack.Screen name="Sign In" component={SignInScreen} />
                <Stack.Screen name="Chats" component={ChatListScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
              </Stack.Navigator>
            {/* </SafeAreaView> */}
          </NavigationContainer>
  
        </>
    );
  }
}

export default App;
