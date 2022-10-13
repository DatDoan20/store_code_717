import { Text, View, Image } from 'react-native'
import React from 'react'
import { styles } from '../styles'
import images from '../../../../assets/images'

export const LoginHeader = () => {
  return (
    <View style={styles.headerContainer} >
      <Text style={styles.titleHeader} >{`Welcome back!\nlet's start now`}</Text>
      <Image style={styles.imgHeader1} source={images.loginHeader1} />
      <Image style={styles.imgHeader2} source={images.loginHeader2} />
    </View>
  )
}
