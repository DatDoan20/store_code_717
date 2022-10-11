import React from "react"
import { View, TouchableOpacity, StyleSheet, ViewStyle, Image, Text } from "react-native"
import { customTheme } from "../../../theme"

interface ButtonVideo {
  callback: () => void
  text: string
  img: any
  btnStyle?: ViewStyle
}
export const ButtonVideo = (props: ButtonVideo) => {
  const { callback, text, img, btnStyle } = props

  return (
    <TouchableOpacity onPress={callback} style={styles.iconContainer}>
      <View style={[styles.iconButtonContainer, btnStyle]}>
        <Image source={img} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.iconText}>{text}</Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    marginVertical: customTheme.spacing.double,
    justifyContent: "flex-end",
  },
  iconButtonContainer: {
    backgroundColor: customTheme.colors.red_1,
    padding: customTheme.spacing.regular,
    borderRadius: customTheme.spacing.massive,
    margin: customTheme.spacing.default,
  },
  icon: {
    width: customTheme.spacing.avatar,
    height: customTheme.spacing.avatar,
    tintColor: customTheme.colors.white,
  },
  iconText: {
    color: customTheme.colors.white,
  },
})
