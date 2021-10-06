import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, InputToolbar } from 'react-native-gifted-chat'
import CustomActions from './CustomActions';

//Custom Chat Features (sharing images and location)
// import CustomActions from './CustomActions';

// Mapview Component
import MapView from 'react-native-maps';

//Firebase DB
const firebase = require('firebase');
require('firebase/firestore');

//Async Storage
import AsyncStorage from '@react-native-community/async-storage';

//NetInfo
import NetInfo from '@react-native-community/netinfo';



export default class Chat extends React.Component {
  constructor() {
    super();

    //firebase info to connect to my database
    var firebaseConfig = {
      apiKey: "AIzaSyByFzqAAaH2sJrclCBwAmWP9QKXgdOIMms",
      authDomain: "spider-chat-21afb.firebaseapp.com",
      projectId: "spider-chat-21afb",
      storageBucket: "spider-chat-21afb.appspot.com",
      messagingSenderId: "429662541016",
      appId: "1:429662541016:web:6b4a5559a47aaf833473ad",
      measurementId: "G-8EERZF05D4"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceMessages = firebase.firestore().collection('messages');
    this.referenceMessageUser = null;

    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
      },
      isConnected: false,
      image: null,
      location: null,

    }

  }



  componentDidMount() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');

        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          console.log(user, typeof user);


          // Update user state with active user
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
            }
          });

          // Create reference to the active users messages
          this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
          // Listen for collection changes
          this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({ isConnected: false })
        // Calls messeages from offline storage
        this.getMessages();
        alert('is offline');
      }
    });

    this.referenceChatMessages = firebase.firestore().collection("messages");

  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.authUnsubscribe();
  }

  //Loads messages from AsyncStorage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //Delete messages from AsyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // Add messages to database
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  // Save Messages to local storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Function to send messages
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      // Make sure to call addMessages so they get saved to the server
      () => {
        this.addMessages();
        // Calls function saves to local storage
        this.saveMessages();
      })
  }

  // Retrieve current messages and store them in the state: messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text || '',
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  }



  // Sets System Message color
  renderSystemMessage(props) {
    let backgroundColor = this.props.route.params.backgroundColor;
    if (backgroundColor !== '#FFFFFF') {
      return (
        <SystemMessage
          {...props}
          textStyle={{ color: '#FFFFFF' }}
          timeTextStyle={{ color: '#FFFFFF' }}
        />
      );
    }
  }

  //If offline, dont render the input toolbar
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  // Sets message bubble color
  renderBubble(props) {
    let backgroundColor = this.props.route.params.backgroundColor;
    if (backgroundColor === '#FFFFFF') {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: '#2d63d3' },
            left: { backgroundColor: '#7e7e7e' }
          }}
          textProps={{
            style: { color: 'white' }
          }}
          timeTextStyle={{
            right: { color: '#f0f0f0' },
            left: { color: '#f0f0f0' }
          }}
        />
      )
    } else {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
          }}
        />
      )
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  // renderCustomActions = (props) =>
  //   <CustomActions {...props} />;

  render() {


    return (
      <View style={{ flex: 1, backgroundColor: this.props.route.params.backColor }}>
        <GiftedChat
          messages={this.state.messages}
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          // renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          onSend={messages => this.onSend(messages)}
          isTyping={true}
          user={this.state.user}
          renderActions={this.renderCustomActions}


        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }

}
