/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
var RandManager = require('./RandManager.js')
var Swiper = require('react-native-swiper')

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu122',
});

const NUM_WALLPAPERS = Platform.select({
  ios: 15,
  android: 5,
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = {
      wallsJSON: [],
      isLoading: true
    }
  }

  fetchWallsJSON() {
    var url = 'https://randomuser.me/api/?results=50'
    fetch(url)
      .then( response => response.json() )
      .then( jsonData => {
        var randomIds = RandManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.results.length-1);
        var walls = [];
        randomIds.forEach(randomId => {
          walls.push(jsonData.results[randomId]);
        });
        this.setState({
          isLoading: false,
          wallsJSON: [].concat(walls)
        });
      })
	  .catch( error => console.log('Fetch error ' + error) )
  }

  componentDidMount() {
    this.fetchWallsJSON()
  }

  renderLoadingMessage() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          color={'#fff'}
          size={'small'} 
          style={{margin: 15}} />
          <Text style={{color: '#fff'}}>Contacting Unsplash</Text>   
      </View>
    )
  }

  renderResults() {
      var {wallsJSON, isLoading} = this.state;
      // console.log(wallsJSON);
      if( !isLoading ) {
        return (
          <Swiper dot={<View style={{backgroundColor:'rgba(255,255,255,.4)', width: 8, height: 8,borderRadius: 10, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
            loop={false}
            onMomentumScrollEnd={this.onMomentumScrollEnd}
          >            
            {wallsJSON.map((wallpaper, index) => {
              return(
                <View key={index} style={styles.main}>
                  <Text style={styles.title}>
                    Name: {wallpaper.name.first}
                  </Text>
                  <Image
                    style={styles.imageSlide}
                    source={{uri: wallpaper.picture.large}}
                  />
                </View>
              );
            })}
          </Swiper>
        )
      }
    }

  render() {
    var {isLoading} = this.state
    if(isLoading)
      return this.renderLoadingMessage()
    else
      return this.renderResults()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  },
  imageSlide: {
    width: '100%', 
    height: '100%'
  },
  main: {
    padding: 10
  }
});
