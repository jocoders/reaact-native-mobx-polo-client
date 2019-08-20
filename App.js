import React from 'react'
import { Platform, StatusBar, View } from 'react-native'
import { Provider } from 'mobx-react'
import Constants from 'expo-constants'
import store from './src/mobx/store'
import AppNavigator from './src/AppNavigator'

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'ios' && (
        <StatusBar color="#068485" barStyle="light-content" style={{ height: Constants.statusBarHeight }} />
      )}
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </View>
  )
}

export default App
