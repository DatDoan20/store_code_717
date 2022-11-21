import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import images from '../../../../assets/images'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const RegisterHeader = ({ goBackHandle }: { goBackHandle: () => void }) => {
  const translateX = useSharedValue(-width / 1.2 - 40)
  const translateY = useSharedValue(-width / 10)
  const translateTextX = useSharedValue(width / 2)

  useFocusEffect(
    useCallback(() => {
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
  );


  const translateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
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
    <View style={styles.container} >
      <TouchableOpacity onPress={goBackHandle} style={styles.backIconContainer} >
        <Image source={images.backArrow} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>
      <Image resizeMode='stretch' source={images.registerHeader1} style={styles.headerImg1} />
      <Animated.Image resizeMode='stretch' source={images.registerHeader2} style={[styles.headerImg2, translateStyles]} />
      <Animated.Text style={[styles.titleHeader, translateStylesText]} >Lets Join!</Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: width / 7,
    marginBottom: 12
  },
  backIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderColor: "#E8ECF4",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 40
  },
  backIcon: {
    width: 24,
    height: 24
  },
  headerImg1: {
    width: width - 40,
    height: width / 1.7,
    position: "absolute",
    left: 0,
    top: 24,
  },
  headerImg2: {
    width: width / 1.2 - 40,
    height: width / 1.2 / 1.7,
    marginTop: 12
    // position: "absolute",
    // left: 0,
    // top: 12 + (((width - 40) - (width / 1.3 - 40)) / 2),
  },
  titleHeader: {
    color: '#fdac36',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 39,
    alignSelf: "flex-end",
    position: "absolute",
    top: 24,
    right: 40
  }
})