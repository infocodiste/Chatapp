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
    TextInput,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';


const Item = ({ object, isSelf }) => (
    <>
        {
            isSelf ?
                <View style={{ backgroundColor: '#b6adc9', alignSelf: 'flex-start', padding: 10, marginVertical: 6, marginHorizontal: 10, borderRadius: 22, marginRight: '30%' }}>
                    <Text style={{ color: object.colour, textAlign: 'left', fontSize: 12 }}>
                        {object.userName}
                    </Text>
                    <Text style={{ color: 'black', textAlign: 'left', fontSize: 18 }}>
                        {object.message}
                    </Text>
                    <Text style={{ color: 'gray', fontSize: 10 }}>
                        {new Date(object.dateTime).toLocaleString()}
                    </Text>
                </View>
                :
                <>
                    <View style={{ backgroundColor: '#211241', alignSelf: 'flex-end', padding: 10, marginVertical: 6, marginHorizontal: 10, borderRadius: 22, marginLeft: '30%' }}>
                        <Text style={{ color: '#ffffff', textAlign: 'right', fontSize: 18 }}>
                            {object.message}
                        </Text>
                        <Text style={{ color: 'gray', fontSize: 10 }}>
                            {new Date(object.dateTime).toLocaleString()}
                        </Text>
                    </View>
                </>
        }
    </>
);



class ChatScreen extends Component {

    renderItem = ({ item }) => (
        <>
            {
                item.userId === this.state.userDetails.uid ?
                    <Item object={item} isSelf={false} />
                    :
                    <Item object={item} isSelf={true} />
            }
        </>
    );

    constructor(props) {
        super(props);
        this.state = {
            userDetails: null,
            userColour: "",
            message: "",
            historyMessage: [],
            roomId:   this.props.route.params.roomName,
            flatList: null
        };
    };

    async componentDidMount() {

        let colour = await AsyncStorage.getItem('userColour');

        let loginData = await AsyncStorage.getItem('loginData');
        console.log('componentDidMount');
        if (loginData != null) {
            let parsed = JSON.parse(loginData);
            this.setState({
                userDetails: parsed.user,
                userColour: colour,
            })
        }



        database()
            .ref('/' + this.state.roomId + '/')
            .orderByValue()
            .on('value', snapshot => {
                var history = [];
                snapshot.forEach((obj) => {
                    var childData = obj.val();
                    history.push({
                        userName: childData.userName,
                        userId: childData.userId,
                        message: childData.message,
                        dateTime: childData.dateTime,
                        colour: childData.colour,
                        key: obj.key,
                    });

                });
                console.log('historyMessage', history);

                this.setState({
                    historyMessage: history
                })

            });

    }

    sendMessage() {
        console.log('Send message :  ', this.state.history);
        Keyboard.dismiss();
        if (this.state.message != "") {
            database()
                .ref('/' + this.state.roomId + '/')
                .push({
                    userName: this.state.userDetails.email,
                    userId: this.state.userDetails.uid,
                    message: this.state.message,
                    colour: this.state.userColour,
                    dateTime: Date.now()
                })
                .then(() => {
                    this.setState({ message: "" });
                })
                .catch((error) => {
                    console.log('Error : ', error);
                });
        }
    }

    didTaplogout() {
        this.props.navigation.pop();
    }

    render() {

        const value = this.state.message;

        return (
            <>

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, marbackgroundColor: 'white', marginTop: Platform.OS === 'ios' ? 90 : 110 }}>


                        <FlatList
                            // inverted : For chat from bottom
                            //inverted  
                            data={this.state.historyMessage}
                            style={{ flex: 1, height: '90%' }}
                            renderItem={this.renderItem}
                            ref="flatList"
                            onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
                            keyExtractor={(item) => item.key}
                        />

                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <TextInput

                                style={{ height: 40, width: "80%", borderColor: '#211241', borderRadius: 20, borderWidth: 1.2, }}
                                placeholder="Message"
                                placeholderTextColor="#211241"
                                value={this.state.message}
                                onChangeText={text => this.setState({ message: text })}
                            />
                            <TouchableOpacity
                                style={{ flex: 1, backgroundColor: '#211241', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginLeft: 10 }}
                                onPress={() => this.sendMessage()}>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>SEND</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
                <ImageBackground
                    source={require('../src/img/header-bg.png')}
                    style={styles.backgrounImage}>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 0 }}>


                        <TouchableOpacity
                            onPress={() => this.didTaplogout()}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'white', marginTop: Platform.OS === 'ios' ? 0 : -35, marginLeft: 10 }}>Back</Text>
                        </TouchableOpacity>

                        <View style={styles.headerView}>
                            <Text style={styles.titleText}>Chat : )</Text>
                        </View>

                    </View>
                </ImageBackground>
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
    },
    titleText: {
        fontSize: 32,
        fontWeight: '700',
        color: 'white',
        marginTop: 40,
        marginLeft: '-15%'
    },

});

export default ChatScreen;
