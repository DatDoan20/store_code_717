import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import RNKommunicateChat from 'react-native-kommunicate-chat';

const startConversation = () => {
  let conversationObject = {
    'appId': "994cbdf20d68dc95ab8488273f7f8c2e",
    // 'withPreChat': true
  }

  RNKommunicateChat.buildConversation(conversationObject, (response, responseMessage) => {
    if (response == "Success") {
      console.log("Conversation Successfully with id:" + responseMessage);
    }
  });
}

const ChatBotScreen = () => {


  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={startConversation} >
        <Text>Start</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ChatBotScreen