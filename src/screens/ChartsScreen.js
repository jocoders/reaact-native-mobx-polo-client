import React, { Component } from 'react'
import { ActivityIndicator, FlatList, Platform, View } from 'react-native'
import { inject, observer } from 'mobx-react'
import { NavigationEvents } from 'react-navigation'
import { ChartsHeader, CryptoItem, IconsHeader, ProjectStatusBar } from '../components'
import { WP, HP } from '../constants'

class ChartsScreen extends Component {
  //*Component mount
  //*Call MobX store & setInterval
  componentDidMount() {
    this.props.store.initInterval()
  }

  //*Component unmount
  //*Call reset MobX store & setInterval
  componentWillUnmount() {
    this.props.store.resetInterval()
  }

  //*Change percent color
  percentColorHandler = number => {
    return number >= 0 ? true : false
  }

  render() {
    return (
      <View>
        <NavigationEvents
          onWillFocus={() => this.props.store.initInterval()}
          onWillBlur={() => this.props.store.resetInterval()}
        />
        {Platform.OS === 'ios' && <ProjectStatusBar />}
        <IconsHeader
          dataError={this.props.store.error}
          header="Charts"
          leftIconName="ios-arrow-back"
          leftIconPress={() => this.props.navigation.navigate('Welcome')}
        />
        <ChartsHeader />
        <ActivityIndicator
          animating={this.props.store.loading}
          color="#068485"
          style={{ top: HP('30%') }}
          size="small"
        />
        <FlatList
          data={this.props.store.data}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <CryptoItem
              name={item.key}
              highBid={item.highestBid}
              lastBid={item.last}
              percent={item.percentChange}
              percentColor={this.percentColorHandler(item.percentChange)}
            />
          )}
        />
      </View>
    )
  }
}

export default inject('store')(observer(ChartsScreen))
