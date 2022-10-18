import { View, Image, Dimensions } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { styles } from '../styles'
import images from '../../../../assets/images'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useFocusEffect } from '@react-navigation/native'

const { width } = Dimensions.get('window');

export const LoginHeader = () => {
  const translateX = useSharedValue(-width / 1.5)
  const translateY = useSharedValue(-width / 5)
  const translateTextX = useSharedValue(-width / 2)

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 500,
      easing: Easing.linear
    })
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.linear
    })
    translateTextX.value = withTiming(0, {
      duration: 500,
      easing: Easing.linear
    })
  }, [])

  const translateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: - translateX.value },
        { translateY: translateY.value }

      ]
    }
  })

  const translateStylesText = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateTextX.value }
      ]
    }
  })

  return (
    <View style={styles.headerContainer} >
      <Animated.Text style={[styles.titleHeader, translateStylesText]} >{`Welcome back!\nlet's start now`}</Animated.Text>
      <Image style={styles.imgHeader1} source={images.loginHeader1} />
      <Animated.Image style={[styles.imgHeader2, translateStyles]} source={images.loginHeader2} />
    </View>
  )
}
