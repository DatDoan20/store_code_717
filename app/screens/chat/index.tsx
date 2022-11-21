import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActionsProps, Bubble, BubbleProps, GiftedChat, IMessage, Reply, Send, SendProps, Actions, InputToolbar } from 'react-native-gifted-chat'
import { Dialogflow_V2, RequestQueryResult } from 'react-native-dialogflow'
import { dialogFlowConfig } from '../../../env'
import firstore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { ChatProps } from '../../navigators/type'
import { isEmpty, random } from 'lodash'
import { CustomActions } from './components'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '../../../assets/images'

const initialAvatar = 'https://img.thuthuat123.com/uploads/2019/07/13/anh-hoa-sen-cuc-ky-dep-mat_090626361.jpg'

const BOT = {
  _id: 2,
  name: "Mr.Bot",
  avatar: initialAvatar
}

const ChatScreen = (props: ChatProps) => {
  const { navigation, route } = props
  const { userId, userName, userAvatar } = route.params

  const USER = {
    _id: userId,
    name: userName,
    avatar: userAvatar || 'https://img.thuthuat123.com/uploads/2019/07/13/anh-hoa-sen-cuc-ky-dep-mat_090626361.jpg'
  }

  const initialMes: IMessage[] = [
    {
      _id: 2,
      text: userName,
      createdAt: new Date().getTime(),
      image: "https://media.istockphoto.com/vectors/blue-cute-robot-vector-id1191411980?k=20&m=1191411980&s=612x612&w=0&h=RwynZNA7Gf-VO3W8cuhI1s9bsKbZ1QZ89rKNrfSJCMA=",
      user: USER
    },
  ]

  const [messages, setMessages] = useState<IMessage[]>()

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogFlowConfig.client_email,
      dialogFlowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogFlowConfig.project_id
    )
    readMessFirebase()

  }, [])

  const goBackHandle = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const readMessFirebase = () => {
    firstore()
      .collection('CHATBOT_HISTORY')
      .doc(userId || "userId")
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get()
      .then((snap) => {
        let mesData: IMessage[] = []
        if (!isEmpty(snap.docs)) {
          snap.docs.map((doc) => {
            const firebaseData = doc.data()
            if (!isEmpty(firebaseData)) {
              const message = {
                ...firebaseData,
                _id: doc.id
              } as IMessage
              mesData.push(message)
            }
          })
        }
        else {
          const message = initialMes[0].text
          Dialogflow_V2.requestQuery(
            message,
            (result) => handleGoogleRes(result),
            (err) => {
              console.log(err)
            }
          )
        }
        setMessages(mesData)
      })
  }

  const addMessFirebase = (mes: IMessage) => {
    const dataAdding: IMessage = {
      ...mes,
      createdAt: new Date().getTime()
    }
    firstore()
      .collection("CHATBOT_HISTORY")
      .doc(userId)
      .collection('MESSAGES')
      .add(dataAdding)
      .catch(err => console.warn(err.toString()))
  }

  const handleGoogleRes = (result: any, userInput?: IMessage[]) => {
    console.log(result);
    const resultData: RequestQueryResult = result
    const payload = resultData.queryResult.fulfillmentMessages.find(i => i.payload)
    const text = resultData.queryResult.fulfillmentMessages[0].text.text[0]
    const _id = resultData.responseId
    sendBotRes(text, _id, userInput, payload)
  }

  const sendBotRes = (text: string, _id: string, userInput?: IMessage[], payload?: any) => {
    if (!isEmpty(payload)) {
      const quickRepliesData: {
        payload: string,
        title: string
      }[] = payload.payload.quick_replies
      const msg: IMessage = {
        _id,
        text,
        createdAt: new Date().getTime(),
        user: BOT,
        quickReplies: {
          type: "radio",
          keepIt: true,
          values: quickRepliesData.map(i => {
            return {
              title: i.title,
              value: i.payload
            }
          })
        }
      }
      addMessFirebase(msg)
      if (userInput) {
        setMessages(GiftedChat.append(userInput, [msg]))
      }
      else {
        setMessages(GiftedChat.append(messages, [msg]))
      }
    }
    else {
      const msg: IMessage = {
        _id,
        text,
        createdAt: new Date().getTime(),
        user: BOT,
      }
      addMessFirebase(msg)
      if (userInput) {
        setMessages(GiftedChat.append(userInput, [msg]))
      }
      else {
        setMessages(GiftedChat.append(messages, [msg]))
      }
    }
  }

  const onSend = (mes: IMessage[]) => {
    const userInput: IMessage[] = GiftedChat.append(messages, mes)
    const message = mes[0].text
    addMessFirebase(mes[0])
    Dialogflow_V2.requestQuery(
      message,
      (result) => handleGoogleRes(result, userInput),
      (err) => {
        setMessages(userInput)
        console.log(err)
      }
    )
  }

  const onQuickReply = (mes: Reply[]) => {
    console.log(mes);

    if (mes.length === 1) {
      onSend([{
        _id: `${mes[0].messageId}id`,
        createdAt: new Date().getTime(),
        text: mes[0].value,
        user: USER
      }])
    }
    else {
      onSend([{
        _id: mes.map(rep => `${rep.messageId}id`).join(''),
        createdAt: new Date().getTime(),
        text: mes.map(rep => rep.value).join(','),
        user: USER
      }])
    }
  }

  const renderBubble = (props: BubbleProps<IMessage>) => {
    return <Bubble {...props}
      textStyle={{
        left: {
          color: "white"
        }
      }}
      wrapperStyle={{
        left: {
          backgroundColor: "pink"
        }
      }} />
  }

  const renderActions = (props: ActionsProps): React.ReactNode => (
    <Actions {...props}
      icon={() => <Image
        source={images.hideCamera}
        resizeMode="contain"
        style={{
          width: 24, height: 24,
          tintColor: "blue"
        }}
      />}
    />
  )

  const renderSend = (props: SendProps<IMessage>) => (
    <Send {...props} containerStyle={{ justifyContent: 'center', alignItems: "center" }}>
      <Text style={{ textAlign: "center", color: "blue", marginHorizontal: 12 }} >Gửi</Text>
    </Send>
  )


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} >
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        backgroundColor: "blue"
      }} >
        <TouchableOpacity onPress={goBackHandle} style={{ paddingHorizontal: 12, justifyContent: 'center', alignItems: "center", marginRight: 12 }} >
          <Image style={{ width: 20, height: 20, tintColor: "white" }} source={images.backArrow} />
        </TouchableOpacity>
        <View style={{ justifyContent: "center", alignItems: "center", borderRadius: 100, width: 40, height: 40, overflow: "hidden" }} >
          <Image source={{ uri: BOT.avatar }} style={{ width: 40, height: 40 }} />
        </View>
        <Text style={{ color: "white", marginLeft: 12, fontSize: 18 }} >MR.Bot</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(mes) => onSend(mes)}
        onQuickReply={(quick) => onQuickReply(quick)}
        user={USER}
        placeholder="Nhập tin nhắn..."
        renderBubble={renderBubble}
        renderSend={renderSend}
        // renderActions={renderActions}
        scrollToBottom
        timeTextStyle={{
          right: {
            color: "lightgray"
          }
        }}
        renderInputToolbar={(props) => <InputToolbar
          {...props}
          containerStyle={{
            marginHorizontal: 12,
            borderWidth: 1,
            borderColor: "blue",
            borderRadius: 100,

          }}
        />}
      />
    </SafeAreaView>
  )
}

export default ChatScreen