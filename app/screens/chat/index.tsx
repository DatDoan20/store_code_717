import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Bubble, BubbleProps, GiftedChat, IMessage, Reply } from 'react-native-gifted-chat'
import { Dialogflow_V2, RequestQueryResult } from 'react-native-dialogflow'
import { dialogFlowConfig } from '../../../env'
import firstore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { ChatProps } from '../../navigators/type'
import { isEmpty, random } from 'lodash'

const initialAvatar = 'https://img.thuthuat123.com/uploads/2019/07/13/anh-hoa-sen-cuc-ky-dep-mat_090626361.jpg'

const BOT = {
  _id: 2,
  name: "Mr.Bot",
  avatar: initialAvatar
}

const USER = {
  _id: 1,
  name: "Mr.User"
}

const ChatScreen = (props: ChatProps) => {
  const { navigation, route } = props
  const { userId, userName, userAvatar } = route.params

  const initialMes: IMessage[] = [
    {
      _id: 2,
      text: 'Hello\nMy name is Bot',
      createdAt: new Date().getTime(),
      image: "https://media.istockphoto.com/vectors/blue-cute-robot-vector-id1191411980?k=20&m=1191411980&s=612x612&w=0&h=RwynZNA7Gf-VO3W8cuhI1s9bsKbZ1QZ89rKNrfSJCMA=",
      user: BOT
    },
  ]

  const [messages, setMessages] = useState<IMessage[]>()
  const [id, setId] = useState<number>(1)
  const [name, setName] = useState<string>('')

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogFlowConfig.client_email,
      dialogFlowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogFlowConfig.project_id
    )
    readMessFirebase()
  }, [])

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
          mesData = [...initialMes]
          mesData.map((e) => {
            addMessFirebase(e)
          })
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

  const handleGoogleRes = (result: any, userInput: IMessage[]) => {
    const resultData: RequestQueryResult = result
    const text = resultData.queryResult.fulfillmentMessages[0].text.text[0]
    const _id = resultData.responseId
    sendBotRes(text, _id, userInput)
  }

  const sendBotRes = (text: string, _id: string, userInput: IMessage[]) => {
    if (text === "Hello, What do you want to buy?") {
      const msg: IMessage = {
        _id,
        text,
        createdAt: new Date().getTime(),
        user: BOT,
        quickReplies: {
          type: "radio",
          keepIt: true,
          values: [
            {
              title: "Shoes",
              value: "Shoes",
            },
            {
              title: "T-shirt",
              value: "T-shirt",
            },
            {
              title: "Jacket",
              value: "Jacket",
            },
          ]
        }
      }
      addMessFirebase(msg)
      setMessages(GiftedChat.append(userInput, [msg]))
    }
    else {
      const msg: IMessage = {
        _id,
        text,
        createdAt: new Date().getTime(),
        user: BOT,
      }
      addMessFirebase(msg)
      setMessages(GiftedChat.append(userInput, [msg]))
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

  return (
    <View style={{ flex: 1, backgroundColor: "white" }} >
      <GiftedChat
        messages={messages}
        onSend={(mes) => onSend(mes)}
        onQuickReply={(quick) => onQuickReply(quick)}
        user={USER}
        renderBubble={renderBubble}

      />
    </View>
  )
}

export default ChatScreen