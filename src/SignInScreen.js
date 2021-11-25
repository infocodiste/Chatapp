/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Dimensions,
    Button,
    TextInput, 
} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from 'react-native-simple-toast';
import LoadingView from './common/LoadingView.js';

class SignInScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            emailID: "",
            password: "",
            isLoading: false
        };
    }

    async componentDidMount() {

        AsyncStorage.setItem('userColour',  '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6));

        let loginData = await AsyncStorage.getItem('loginData');
        console.log('Response : ',loginData);

        if (loginData != null) {
            let parsed = JSON.parse(loginData);
            console.log('Login Data : ', parsed)
            Toast.show('Already Login');
            this.props.navigation.navigate('Chats');
        }
    }

    async didTapCreateUser() {

        if (this.state.emailID == "" || this.state.password == "") {
            Toast.show('Email Id or Password can not be blank');
        } else {
            this.setState({ isLoading: true });
            await firebase.auth().createUserWithEmailAndPassword(this.state.emailID, this.state.password)
                .then(result => {
                    console.log('Result : ', result);
                    AsyncStorage.setItem('loginData', JSON.stringify(result));
                    this.setState({ isLoading: false });
                    Toast.show('Signup Succeessfully');
                    this.props.navigation.navigate('Chats');
                })
                .catch(error => {
                    this.setState({ isLoading: false });
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                        Toast.show('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                        Toast.show('That email address is invalid!');
                    }
                    console.error('Error : ', error);
                });
        }
    }

    async didTapSignInUser() {
        if (this.state.emailID == "" || this.state.password == "") {
            Toast.show('Email Id or Password can not be blank');
        } else {
            this.setState({ isLoading: true });
            await auth().signInWithEmailAndPassword(this.state.emailID, this.state.password)
                .then((result) => {
                    console.log('Result : ', result);
                    this.setState({ isLoading: false });
                    AsyncStorage.setItem('loginData', JSON.stringify(result));
                    Toast.show('Login Succeessfully');
                    this.props.navigation.navigate('Chats');
                })
                .catch(error => {
                    this.setState({ isLoading: false });
                    console.error('Erro : ', error);
                    Toast.show('Your account not found');
                });
        }
    }

    render() {
        return (
            <>
                <View style={styles.contentView}>
                    <View style={{ margin: 20 }}>
                        <TextInput
                            style={{ margin: 0, height: 40, borderColor: '#211241', borderRadius: 20, borderWidth: 1.2, textAlign: 'center' }}
                            placeholder="Email Id"
                            placeholderTextColor="#211241"
                            onChangeText={text => this.setState({ emailID: text })}
                            textContentType='emailAddress'
                        />
                        <TextInput
                            style={{ marginTop: 20, height: 40, borderColor: '#211241', borderRadius: 20, borderWidth: 1.2, textAlign: 'center' }}
                            placeholder="Password"
                            placeholderTextColor="#211241"
                            onChangeText={text => this.setState({ password: text })}
                            textContentType='password'
                            secureTextEntry={true}
                        />
                    </View>


                    <View style={{ marginTop: 10, flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <Button
                            color="#211241"
                            onPress={() => this.didTapCreateUser()}
                            title="Sign Up"
                        />
                        <View style={{ width: "5%", alignContent: 'center' }} />
                        <View style={{ width: 1, backgroundColor: 'gray', alignContent: 'center' }} />
                        <View style={{ width: "5%", alignContent: 'center' }} />
                        <Button
                            color="#211241"
                            onPress={() => this.didTapSignInUser()}
                            title="Sign In"
                            backgroundColor="#211241"
                        />
                    </View>
                </View>

                <ImageBackground
                    source={require('../src/img/header-bg.png')}
                    style={styles.backgrounImage}>

                    <View style={styles.headerView}>
                        <Text style={styles.titleText}>Welcome : )</Text>
                    </View>

                </ImageBackground>

                {
                    this.state.isLoading ?
                        <LoadingView />
                        : null
                }
            </>
        );
    };
};

const styles = StyleSheet.create({
    contentView: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignContent: 'center'
    },
    backgrounImage: {
        height: 115,
        flex: 1,
        position: 'absolute',
        borderColor: 'red',
        top: 0,
        width: Dimensions.get('window').width
    },
    headerView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 30
    },
    titleText: {
        fontSize: 32,
        fontWeight: '700',
        color: 'white'
    }
});

export default SignInScreen;
