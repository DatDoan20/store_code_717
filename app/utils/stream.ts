import { mediaDevices } from "react-native-webrtc"

export const getMediaStream = async () => {
  let isFront = true
  const sourceInfos = await mediaDevices.enumerateDevices()
  let videoSourceId
  for (let i = 0; i < sourceInfos.length; i++) {
    const sourceInfo = sourceInfos[i]
    if (
      sourceInfo.kind == "videoinput" &&
      sourceInfo.facing == (isFront ? "front" : "environment")
    ) {
      videoSourceId = sourceInfo.deviceId
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
      facingMode: isFront ? "user" : "environment",
      optional: [
        {
          sourceId: videoSourceId,
        },
      ],
    },
  })
  return stream
}
