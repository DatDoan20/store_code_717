import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ActionsProps, IMessage } from 'react-native-gifted-chat'

interface CustomActionsProps extends ActionsProps {
  onSend: (mes: IMessage[]) => void
}

export const CustomActions = (props: CustomActionsProps) => {
  const { onSend, containerStyle, icon, iconTextStyle, onPressActionButton, optionTintColor, options, wrapperStyle } = props


  const renderIcon = (): React.ReactNode => {
    if (icon) {
      return icon()
    }
    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={[styles.container, props.containerStyle]}
      onPress={onPressActionButton}
    >
      {renderIcon()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})