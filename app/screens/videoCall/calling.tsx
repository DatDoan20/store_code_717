import React from 'react';
import {View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import {RTCView, MediaStream} from 'react-native-webrtc';
import images from '../../../assets/images';
import {customTheme} from '../../theme';
import {ButtonVideo} from './components/buttonVideo';

const {width} = Dimensions.get('window');
interface Calling {
  localStream: MediaStream | null;
  hangup: () => void;
}
export const Calling = (props: Calling) => {
  const {localStream, hangup} = props;
  return (
    <View style={styles.root}>
      <RTCView
        style={styles.absolute}
        objectFit={'cover'}
        streamURL={localStream ? localStream.toURL() : ''}
      />
      <View style={styles.containerAvatar}>
        <Image
          source={images.avatarLucy}
          style={styles.avatar}
          resizeMode={'contain'}
        />
        <Text style={styles.name}>Hao</Text>
        <Text style={styles.phoneNumber}>Đang gọi...</Text>
      </View>
      <View style={styles.containerBtn}>
        <ButtonVideo callback={hangup} text={'Huỷ'} img={images.close} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: customTheme.colors.white,
  },
  name: {
    color: customTheme.colors.white,
    marginTop: customTheme.spacing.small,
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
  absolute: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },

  phoneNumber: {
    color: customTheme.colors.white,
  },
  containerBtn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
