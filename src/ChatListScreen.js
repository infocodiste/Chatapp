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
    TouchableOpacity,
    FlatList,
    TextInput,
    SafeAreaView,
    Platform,
    Keyboard
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import database from '@react-native-firebase/database';




const Item = ({ object }) => (
    <>
        <View style={{ backgroundColor: '#e6e0df', padding: 10, marginVertical: 6, marginHorizontal: 10, borderRadius: 22, }}>
            <Text style={{ color: '#211241', textAlign: 'left', fontSize: 18, marginLeft: 10 }}>
                {object.roomName}
            </Text>
        </View>
    </>
);




class ChatListScreen extends Component {


    renderItem = ({ item }) => (
        <TouchableOpacity
            style={{ flex: 1}}
            onPress={() => this.didTapGrop(item)}>
            <Item object={item} />
        </TouchableOpacity>

    );

    didTapGrop(objRoom) {
        console.log('Room data ; ',objRoom.roomName);

        this.props.navigation.navigate('Chat', {roomName: objRoom.roomName });
    }

    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            userDetails: null,
            roomName: ""
        };
    }

    async componentDidMount() {

        let loginData = await AsyncStorage.getItem('loginData');
        console.log('componentDidMount');
        if (loginData != null) {
            let parsed = JSON.parse(loginData);
            this.setState({
                userDetails: parsed.user,
            })
        }


        database()
            .ref('/room/')
            .orderByValue()
            .on('value', roomData => {
                // console.log('snapshot', roomData.val());
                var history = [];

                roomData.forEach((objChat) => {

                    var objchat = objChat.val();
                    console.log('objchat : ', objchat);

                    history.push({
                        roomName: objchat.roomName,
                        key: objchat.key
                    });
                });
                this.setState({
                    rooms: history
                })
                console.log('historyMessage', history);
            });
    }

    async createRoom() {
        console.log('Room name :  ', this.state.roomName);
        Keyboard.dismiss();
        if (this.state.roomName != "") {
            database()
                .ref('/room/' )
                .push({
                    roomName : this.state.roomName,
                })
                .then(() => {
                    Toast.show('group created !')
                })
                .catch((error) => {
                    console.log('Error : ', error);
                });
        }
    }

    didTaplogout() {
        AsyncStorage.setItem('loginData', '');
        Toast.show('Logout successfully!');
        this.props.navigation.pop();
    }

    render() {
        return (
            <>

                <SafeAreaView style={{ flex: 1 }}>

                    <View style={{ marginTop: 90, margin: 10, flexDirection: 'row' }}>
                        <TextInput
                            style={{ height: 40, width: '60%', borderColor: '#211241', borderRadius: 20, borderWidth: 1.2, textAlign: 'center' }}
                            placeholder="Room/Group Name"
                            placeholderTextColor="#211241"
                            onChangeText={text => this.setState({ roomName: text })}
                        />

                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: '#211241', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginLeft: 10 }}
                            onPress={() => this.createRoom()}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Create Room</Text>
                        </TouchableOpacity>


                    </View>

                    <FlatList
                        data={this.state.rooms}
                        style={{ flex: 1, margin: 5, marginTop: 0 }}
                        renderItem={this.renderItem}
                        //ref="flatList"
                        //onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
                        keyExtractor={(item) => item.roomName}
                    />
                </SafeAreaView>



                <ImageBackground
                    source={require('../src/img/header-bg.png')}
                    style={styles.backgrounImage}>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 0 }}>


                        <TouchableOpacity
                            onPress={() => this.didTaplogout()}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: 'white', marginTop: Platform.OS === 'ios' ? 0 : -35, marginLeft: 10 }}>Logout</Text>
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

export default ChatListScreen;
