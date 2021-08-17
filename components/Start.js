import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      backColor: '#757083',
    }
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground
          style={styles.imgBack}
          source={require('../assets/web.jpeg')}
        >
          <View style={styles.mainTitle}>
            <Text style={styles.title}>SpiderChat </Text>
          </View>
          <View style={styles.box}>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(name => this.setState({ name }))}
              value={this.state.name}
              placeholder='Type here ...'
            />
            <View>
              <Text style={styles.backColor}> Select Background Color</Text>
              <View style={styles.colors}>
                <TouchableOpacity
                  style={styles.colorSelection1}
                  onPress={() => this.setState({ backColor: '#090C08' })}
                />
                <TouchableOpacity
                  style={styles.colorSelection2}
                  onPress={() => this.setState({ backColor: '#474056' })}
                />
                <TouchableOpacity
                  style={styles.colorSelection3}
                  onPress={() => this.setState({ backColor: '#8A95A5' })}
                />
                <TouchableOpacity
                  style={styles.colorSelection4}
                  onPress={() => this.setState({ backColor: '#B9C6AE' })}
                />
              </View>
            </View>

            <TouchableOpacity
              accessible={true}
              accessibilityLabel="More options"
              accessibilityHint="Let’s you choose to send an image or your geolocation."
              accessibilityRole="button"
              title="Go to Chat"
              style={styles.startButton, { backgroundColor: this.state.backColor }}
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, backColor: this.state.backColor })}
            >
              <Text style={styles.goText}>Let's Chat!</Text>
            </TouchableOpacity>
          </View>


        </ImageBackground>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  mainTitle: {
    flex: 0.5,
    fontSize: 45,
  },

  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    top: 15,
    height: 60,
  },

  backColor: {
    textAlign: 'center',
    marginBottom: '3%',

  },

  box: {
    minHeight: 260,
    height: '44%',
    backgroundColor: '#fff',
    width: '88%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: '6%',
    paddingRight: '6%',
    // borderColor: 'gray',
    // borderWidth: 1

  },

  colors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  imgBack: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  colorSelection1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  colorSelection2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  colorSelection3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  colorSelection4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  startButton: {
    height: 60,
    color: '#fff',
    fontSize: 80,
    fontWeight: '300',
    width: '88%',

  },

  goText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 60,

  },

});