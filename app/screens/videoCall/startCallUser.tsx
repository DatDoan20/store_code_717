import React, {FC, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {customTheme} from '../../theme';
import firestore from '@react-native-firebase/firestore';
export enum TypeVideoCall {
  CALLEE,
  CALLER,
}

export type VideoCall = {
  type: TypeVideoCall;
};

export const StartCallUserScreen: FC = (props: any) => {
  const handleStartCall = () => {
    const caller: VideoCall = {
      type: TypeVideoCall.CALLER,
    };
    props.navigation.navigate('VideoCallWebRtc', caller);
  };

  const handleReceiveCall = () => {
    const callee: VideoCall = {
      type: TypeVideoCall.CALLEE,
    };
    props.navigation.navigate('VideoCallWebRtc', callee);
  };

  useEffect(() => {
    const cRef = firestore().collection('meet').doc('chatId');
    const subscribeListenIncoming = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (data?.offer) {
        handleReceiveCall();
      }
    });
    return () => {
      subscribeListenIncoming();
    };
  }, []);

  // Err or not get local stream yet
  return (
    <View style={styles.root}>
      <TouchableOpacity
        onPress={handleStartCall}
        style={styles.btnStartMakeCall}>
        <Text style={styles.textErr}>📞 Start Call Video Web Rtc</Text>
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
