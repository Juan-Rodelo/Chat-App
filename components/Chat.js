import React from 'react';
import { View, Text, Button } from 'react-native';


export default class Chat extends React.Component {
  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    return (

      <View style={{
        flex: 1, backgroundColor: this.props.route.params.backColor, justifyContent: 'center', alignItems: 'center',


      }}>
        <Text style={{
          fontSize: 45, fontWeight: 'bold', color: '#fff',
        }}> Welcome!</Text>
      </View>
    )
  }
}

