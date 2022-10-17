import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {customTheme} from '../../theme';
import {
  getHashKey,
  getUserProfile,
  LoginVia,
  zaloLogin,
} from '../../utils/zalo';

export const ZaloLoginScreen: FC = (props: any) => {
  const [isZaloLogin, setIsZaloLogin] = useState<boolean>(false);

  const handleLogin = async () => {
    const result: boolean = await zaloLogin('app');
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
    if (isZaloLogin) {
      getUserProfile();
    }
  }, [isZaloLogin]);

  return (
    <View style={styles.root}>
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
    justifyContent: 'center',
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
});
