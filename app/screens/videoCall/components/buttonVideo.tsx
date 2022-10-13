import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Image,
  Text,
} from 'react-native';
import images from '../../../../assets/images';
import {customTheme} from '../../../theme';

interface ButtonVideo {
  callback: () => void;
  text: string;
  img?: any;
  btnStyle?: ViewStyle;
}
export const ButtonVideo = (props: ButtonVideo) => {
  const {callback, text, img, btnStyle} = props;
  const [btnText, setBtnText] = useState<string>(text);

  const handleClick = () => {
    callback();
    changeBtnText();
  };

  const changeBtnText = () => {
    if (btnText === 'Ẩn camera') {
      setBtnText('Hiện camera');
      return;
    }
    if (btnText === 'Hiện camera') {
      setBtnText('Ẩn camera');
      return;
    }
    if (btnText === 'Tắt âm') {
      setBtnText('Mở âm');
      return;
    }
    if (btnText === 'Mở âm') {
      setBtnText('Tắt âm');
      return;
    }
  };

  const getBtnIcon = () => {
    let icon;
    switch (btnText) {
      case 'Ẩn camera':
        icon = images.hideCamera;
        break;
      case 'Hiện camera':
        icon = images.videoCall;
        break;
      case 'Tắt âm':
        icon = images.mute;
        break;
      case 'Mở âm':
        icon = images.unmute;
        break;
      case 'Đổi camera':
        icon = images.switchCamera;
        break;
      default:
        icon = images.close;
        break;
    }
    return icon;
  };

  return (
    <TouchableOpacity onPress={handleClick} style={styles.iconContainer}>
      <View style={[styles.iconButtonContainer, btnStyle]}>
        <Image
          source={img ? img : getBtnIcon()}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.iconText}>{btnText}</Text>
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
});
