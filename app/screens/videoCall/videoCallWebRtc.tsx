import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import React, {FC, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  EventOnAddStream,
  EventOnCandidate,
  MediaStreamTrack,
} from 'react-native-webrtc';
import images from '../../../assets/images';
import {customTheme} from '../../theme';
import {getMediaStream} from '../../utils/stream';
import {Calling} from './calling';
import {ButtonVideo} from './components/buttonVideo';
import {IncomingCall} from './incomingCall';
// import { goBack } from "../../navigators"

const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};

export const VideoCallScreenWebRtc: FC = (props: any) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [getIncomingCall, setGetIncomingCall] = useState<boolean>(false);
  const [hideCam, setHideCam] = useState<boolean>(false);
  const pc = useRef<RTCPeerConnection | null>();
  const connecting = useRef(false);
  // const flagHangup = useRef<boolean>(false)

  useEffect(() => {
    const cRef = firestore().collection('meet').doc('chatId');
    const subscribeListenIncoming = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();

      // Listen receive Answer
      if (pc.current && !pc.current.remoteDescription && data && data.answer) {
        console.log('set remote');
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      // Listen receive Offer (if there is offer for chatId -> receive incoming call)
      if (data && data.offer && !connecting.current) {
        setGetIncomingCall(true);
      }
    });

    // hangup when data callee was removed (caller/ callee was clicked hangup button when video call connected)
    const subscribeHangupCallee = cRef
      .collection('callee')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'removed') {
            hangup();
          }
        });
      });

    // hangup when data caller was removed (when video call not connect)
    const subscribeHangupCaller = cRef
      .collection('caller')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'removed') {
            hangup();
          }
        });
      });

    return () => {
      subscribeListenIncoming();
      subscribeHangupCallee();
      subscribeHangupCaller();
    };
  }, []);

  const setUpWebRtc = async () => {
    pc.current = new RTCPeerConnection(configuration);

    // Get media stream for calling
    const stream = await getMediaStream();
    if (stream) {
      console.log('set local media stream');
      setLocalStream(stream);
      pc.current.addStream(stream);
    }

    // Get remote stream once it's available
    pc.current.onaddstream = (event: EventOnAddStream) => {
      setRemoteStream(event.stream);
    };
  };

  const createCall = async () => {
    console.log('Calling...');
    connecting.current = true;

    //Set up WebRtc
    await setUpWebRtc();

    //Document for calling
    const cRef = firestore().collection('meet').doc('chatId');

    if (pc.current) {
      const offer = await pc.current.createOffer();
      pc.current.setLocalDescription(offer);

      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };

      cRef.set(cWithOffer);
    }

    //Exchange the ice candidate between caller and callee
    collectIceCandidates(cRef, 'caller', 'callee');
  };

  const join = async () => {
    console.log('Joining the call');
    connecting.current = true;

    const cRef = firestore().collection('meet').doc('chatId');
    const offer = (await cRef.get()).data()?.offer;
    if (offer) {
      //Set up WebRtc
      await setUpWebRtc();

      if (pc.current) {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        // Create answer and update document with answer
        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);
        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        cRef.update(cWithAnswer); //listen return answer in useEffects
      }
      //Exchange the ice candidate between caller and callee
      //It reversed, joining part is callee
      collectIceCandidates(cRef, 'callee', 'caller');
    }
    setGetIncomingCall(false);
  };

  const hangup = () => {
    connecting.current = false;
    streamCleanUp();
    firestoreCleanUp();
    setLocalStream(null);
    setRemoteStream(null);
    setGetIncomingCall(false);
    console.log('clear');
  };

  const switchCamera = () => {
    localStream?.getVideoTracks().forEach((track: any) => {
      track._switchCamera();
    });
  };

  const hideAndOpenCamera = () => {
    localStream?.getVideoTracks().forEach((track: MediaStreamTrack) => {
      track.enabled = !track.enabled;
    });
    // setHideCam(!localStream.getVideoTracks()[0].enabled)
  };

  const muteAndUnmute = () => {
    localStream?.getAudioTracks().forEach((track: MediaStreamTrack) => {
      track.enabled = !track.enabled;
    });
  };

  // Helper function
  // Disconnecting the call -> close connection, release stream, delete document call
  const streamCleanUp = () => {
    if (localStream) {
      localStream.getTracks()[0].stop();
      localStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
        console.log('190');
      });
      pc.current?.removeStream(localStream);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
        console.log('197');
      });
      pc.current?.removeStream(remoteStream);
    }
    pc.current?.close();
    pc.current = null;
  };

  const firestoreCleanUp = async () => {
    const cRef = firestore().collection('meet').doc('chatId');
    if (cRef) {
      const calleeCandidate = await cRef.collection('callee').get();
      calleeCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });
      const callerCandidate = await cRef.collection('caller').get();
      callerCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });
      cRef.delete();
    }
  };

  const collectIceCandidates = async (
    cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    localName: string,
    remoteName: string,
  ) => {
    const candidateCollection = cRef.collection(localName);

    if (pc.current) {
      //On new ice candidate and add it to firestore (send the event.candidate onto the person you're calling.)
      pc.current.onicecandidate = (event: EventOnCandidate) => {
        if (event.candidate) {
          candidateCollection.add(event.candidate);
        }
      };
    }

    // Get ICE candidate added to firestore and update the local pc
    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach((change: any) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  // Getting Incoming Call...
  if (getIncomingCall) {
    return <IncomingCall hangup={hangup} join={join} />;
  }

  // Calling....
  if (localStream && !remoteStream) {
    return <Calling localStream={localStream} hangup={hangup} />;
  }

  // Calling success, connected
  if (localStream && remoteStream) {
    return (
      <View style={{flex: 1, backgroundColor: customTheme.colors.white}}>
        <RTCView
          style={styles.remoteStream}
          objectFit={'cover'}
          streamURL={remoteStream.toURL()}
        />
        <RTCView
          style={styles.localStream}
          objectFit={'cover'}
          streamURL={localStream.toURL()}
        />
        <View style={styles.containerBtn}>
          <ButtonVideo
            callback={hideAndOpenCamera}
            text={'Ẩn camera'}
            img={images.hideCamera}
            btnStyle={styles.blue}
          />
          <ButtonVideo
            callback={muteAndUnmute}
            text={'Tắt âm'}
            img={images.mute}
            btnStyle={styles.blue}
          />
          <ButtonVideo
            callback={switchCamera}
            text={'Đổi camera'}
            img={images.switchCamera}
            btnStyle={styles.blue}
          />
          <ButtonVideo callback={hangup} text={'Huỷ'} img={images.close} />
        </View>
      </View>
    );
  }

  // Err or not get local stream yet
  return (
    <View style={styles.root}>
      <TouchableOpacity onPress={createCall} style={styles.btnStartMakeCall}>
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
  remoteStream: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  localStream: {
    position: 'absolute',
    width: 100,
    height: 150,
    top: 0,
    left: 20,
  },
  containerBtn: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flexDirection: 'row',
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
  blue: {backgroundColor: customTheme.colors.blue_3},
});
