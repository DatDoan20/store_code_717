import { StyleSheet, Text, View, TouchableOpacity, StyleProp, TextStyle, ViewStyle } from 'react-native'
import React from 'react'

interface ButtonProps {
  onPress?: () => void,
  title: string,
  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
}

export const Button = (props: ButtonProps) => {
  const { containerStyle, title, titleStyle, onPress } = props

  const pressHandle = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacity onPress={pressHandle} style={[styles.container, containerStyle]} >
      <Text style={[styles.title, titleStyle]} >{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdac36"
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 18,
    color: "white"
  }
})