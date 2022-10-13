import {mediaDevices} from 'react-native-webrtc';
export default class Stream {
  static async getMediaStream() {
    try {
      // const isFront = true;
      const sourceInfos = await mediaDevices.enumerateDevices();
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'videoinput' && sourceInfo.facing === 'front') {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 480,
            minFrameRate: 30,
          },
          facingMode: 'user',
          optional: [
            {
              sourceId: videoSourceId,
            },
          ],
        },
      });
      // console.log('get local stream:', stream);
      return stream;
    } catch (e) {
      console.log('get local stream error:', e);
    }
  }
}
