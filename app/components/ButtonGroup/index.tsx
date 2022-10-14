import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ButtonGroupData, IconButtonInterface } from './data'
import { EnumButtonGroup } from '../../utils/enums'
import { isFunction } from 'lodash'

const ButtonIcon = ({ item, callBackItem }: { item: IconButtonInterface, callBackItem: (key: EnumButtonGroup) => void }) => {

  const callBackHandle = () => {
    callBackItem(item.key)
  }

  return (
    <TouchableOpacity onPress={callBackHandle} style={styles.btnContainer} >
      <Image style={styles.btnIcon} source={item.img} />
    </TouchableOpacity>
  )
}

interface ButtonGroupProps {
  onPressFB?: () => void
  onPressGG?: () => void
  onPressAPL?: () => void
}

export const ButtonGroup = (props: ButtonGroupProps) => {
  const { onPressAPL, onPressFB, onPressGG } = props

  const pressItem = (key: EnumButtonGroup) => {
    switch (key) {
      case EnumButtonGroup.FACEBOOK:
        if (isFunction(onPressFB)) {
          onPressFB()
        }
        break;
      case EnumButtonGroup.GOOGLE:
        if (isFunction(onPressGG)) {
          onPressGG()
        }
      default:
        if (isFunction(onPressAPL)) {
          onPressAPL()
        }
        break;
    }
  }

  return (
    <View style={styles.container} >
      {
        ButtonGroupData.map((e, i) => <ButtonIcon item={e} key={i} callBackItem={pressItem} />)
      }
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnIcon: {
    resizeMode: "contain",
    width: "100%",
    height: 40,
    tintColor: "#fdac36"
  },
  btnContainer: {
    padding: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#fdac36",
    borderWidth: 2,
    marginRight: 8,
    borderRadius: 4
  }
})