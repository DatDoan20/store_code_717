# Welcome to your test project!

## Step config, implement video call

### Step 1

Install package:

- react-native-firebase/firestore
- react-native-firebase/app
- react-native-webrtc@1.92.1

### Step 2

Add STUN Server:

```jsx
const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
```

### Step 3

Setup WebRtc:

- Init RTCPeerConnection
- Get local stream
- Listen, get remote stream

```jsx
const setUpWebRtc = async () => {
  // Init RTCPeerConnection
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
```

### Step 4

Handle Send And Receive Candidate

```jsx
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
```

### Step 5

Handle Create Call function (Caller will use this function):

- Signaling: set, send "Offer" and receive "Answer" (I will receive Answer in Step 9)
- Send candidate from Caller, and receive candidate from Callee (collectIceCandidates)

```jsx
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
```

### Step 6

Handle Join function (Callee will use this function):

- Signaling, set, send "Answer" and receive "Offer"
- Send candidate from Callee, and receive candidate from Caller (collectIceCandidates)

```jsx
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
```

### Step 7

Show video call P2P

- Get Url of localStream and remoteStream
- Pass Url to RTCView to Show video call

```jsx
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
        <ButtonVideo callback={hangup} text={'Huỷ'} img={images.close} />
      </View>
    </View>
  );
}
```

### Step 8

Handle hangup for caller and callee

- clear stream
- clear data in database
- Remove RTCPeerConnection

```jsx
const hangup = () => {
  connecting.current = false;
  streamCleanUp();
  firestoreCleanUp();
  setLocalStream(null);
  setRemoteStream(null);
  setGetIncomingCall(false);
  console.log('clear');
};

const streamCleanUp = () => {
  if (localStream) {
    localStream.getTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });
    pc.current?.removeStream(localStream);
  }
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => {
      track.stop();
      track.enabled = false;
    });
    pc.current?.removeStream(remoteStream);
  }
  pc.current?.close();
  pc.current = null;
};
```

### Step 9

Final Step:

- Listen Answer
- Listen for coming call
- Listen when data was remove -> call function hangup

```jsx
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
```
