import React from 'react';
import {View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../../assets/images';
import {customTheme} from '../../theme';
import {ButtonVideo} from './components/buttonVideo';
import {Ring} from './components/ring';

const {width} = Dimensions.get('window');

interface IncomingCall {
  hangup: () => void;
  join: () => void;
}

export const IncomingCall = (props: IncomingCall) => {
  const colorsHeader = [
    customTheme.colors.startSeller_1,
    customTheme.colors.endSeller_1,
  ];

  return (
    <LinearGradient colors={colorsHeader} style={styles.bg}>
      <View style={styles.containerAvatar}>
        {[...Array(3).keys()].map((_, index) => (
          <Ring key={index} index={index} />
        ))}
        <Image
          source={images.avatarLucy}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.name}>Dat</Text>
      <Text style={styles.phoneNumber}>Cuộc gọi video...</Text>
      <View style={styles.row}>
        <ButtonVideo
          callback={props.hangup}
          text={'Từ chối'}
          img={images.close}
        />
        <ButtonVideo
          callback={props.join}
          text={'Nghe'}
          img={images.videoCall}
          btnStyle={{backgroundColor: customTheme.colors.blue_3}}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  name: {
    color: customTheme.colors.white,
  },
  containerAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width / 4,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: customTheme.colors.white,
  },
  phoneNumber: {
    color: customTheme.colors.white,
  },
  bg: {
    backgroundColor: customTheme.colors.red_1,
    flex: 1,
    alignItems: 'center',
    padding: customTheme.spacing.default,
    paddingBottom: customTheme.spacing.massive,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    alignItems: 'flex-end',
  },
});
