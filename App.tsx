import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppProvider} from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AppProvider>
        <NavigationContainer>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#ec4899"
            translucent={false}
          />
          <MainNavigator />
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
};

export default App;