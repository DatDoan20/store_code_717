import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Animated from 'react-native-reanimated';
import {customTheme} from '../../../theme';

interface Button {
  img: any;
  btnRStyle: any;
}
export const Button = (props: Button) => {
  const {img, btnRStyle} = props;
  return (
    <TouchableOpacity onPress={() => {}} style={styles.iconContainer}>
      <Animated.View style={[styles.iconButtonContainer, btnRStyle]}>
        <Image source={img} style={styles.icon} resizeMode="contain" />
      </Animated.View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginVertical: customTheme.spacing.double,
    justifyContent: 'flex-end',
  },
  iconButtonContainer: {
    backgroundColor: customTheme.colors.endSeller_1,
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
});
