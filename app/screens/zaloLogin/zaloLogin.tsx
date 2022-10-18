import React, {FC, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import images from '../../../assets/images';
import {customTheme} from '../../theme';
import {
  getHashKey,
  getUserProfile,
  UserProfile,
  zaloLogin,
} from '../../utils/zalo';

const {width} = Dimensions.get('window');

export const ZaloLoginScreen: FC = (props: any) => {
  const [isZaloLogin, setIsZaloLogin] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleLogin = async () => {
    const result: boolean = await zaloLogin('app_or_web');
    console.log('zaloLogin result: ', result);
    if (result) {
      setIsZaloLogin(result);
    }
  };

  useEffect(() => {
    (async () => {
      const hashKey = await getHashKey();
      console.log('hashKey: ', hashKey);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (isZaloLogin) {
        const userProfile = await getUserProfile();
        if (userProfile) setUserProfile(userProfile);
      }
    })();
  }, [isZaloLogin]);

  return (
    <View style={styles.root}>
      <View style={styles.containerAvatar}>
        <Image
          source={
            userProfile?.picture.data.url
              ? {uri: userProfile?.picture.data.url}
              : images.avatarLucy
          }
          style={styles.avatar}
          resizeMode={'contain'}
        />
        <Text style={styles.name}>
          {'name: ' +
            userProfile?.name +
            '\n id: ' +
            userProfile?.id +
            '\n birthday: ' +
            userProfile?.birthday}
        </Text>
      </View>

      <TouchableOpacity onPress={handleLogin} style={styles.btnStartMakeCall}>
        <Text style={styles.textErr}>Login zalo test</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: customTheme.colors.white,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textErr: {
    textAlign: 'center',
    color: 'black',
  },
  btnStartMakeCall: {
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  containerAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: customTheme.colors.black,
  },
  name: {
    color: customTheme.colors.black,
    marginTop: customTheme.spacing.small,
    textAlign: 'center',
  },
});
