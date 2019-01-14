import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import SearchInput from './components/SearchInput';

import getImageForWeather from './utils/getImageForWeather';
import { fetchLocationId, fetchWeather } from './utils/api';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: 'Lagos',
      error: false,
      loading: false,
      temperature: 0,
      weather: '',
    }
  }

  componentDidMount() {
    this.handleUpdateLocation('Lagos');
  }

  handleUpdateLocation = city => {
    if (!city) return;

    this.setState({
      location: city,
      loading: true
    }, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(
          locationId,
        );

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
        });
      } catch (e) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };
  
  render() {
    const { location, weather, temperature, loading, error } = this.state;

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container} behavior='padding'>
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        > 

          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="#0000ff" size="large" />
            {!loading && (
              <View>
              {error && (
                <Text style={[styles.smallText, styles.textStyle]}>
                  Could not load weather, please try a different city.
                </Text>
              )}

              {!error && (
                <View>
                  <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
                  <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                  <Text style={[styles.largeText, styles.textStyle]}>{Math.round(temperature)}°</Text>
                  </View>
                )}

                <SearchInput
                  placeholder='Search any city'
                  onSubmit={this.handleUpdateLocation}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  textStyle: {
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'AvenirNext-Regular',
      },
      android: {
        fontFamily: 'Roboto',
      }
    }),
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
  textInput: {
    backgroundColor: '#666',
    color: 'white',
    height: 40,
    width: 300,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignSelf: 'center'
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  }
});

