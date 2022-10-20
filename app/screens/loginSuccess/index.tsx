import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { Button } from '../../components'
import { loginSuccessProps } from '../../navigators/type'
import { EnumLoginBy } from '../../utils/enums'
import { APP_ID, getLoginType } from '../../utils/functions'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './styles'
import images from '../../../assets/images'
import RNKommunicateChat from 'react-native-kommunicate-chat'

const LoginSuccess = (props: loginSuccessProps) => {
  const { navigation, route } = props
  const curUser = auth().currentUser
  const loginType: EnumLoginBy = getLoginType(curUser)
  const imgUri = curUser?.photoURL
  const userName = curUser?.displayName || "anonymous"
  const userEmail = curUser?.email || "-"

  const [userLoginId, setUserLoginId] = useState<string>('')

  useEffect(() => {
    loginUserKommunicate()
  }, [])

  const chatWithListBot = () => {
    let conversationObject = {
      'appId': APP_ID, // The [APP_ID](https://dashboard.kommunicate.io/settings/install) obtained from kommunicate dashboard.
      'botIds': ['blit-6kzes', 'thresh-f2srr'],
    }

    RNKommunicateChat.buildConversation(conversationObject, (response, responseMessage) => {
      if (response == "Success") {
        console.log("Conversation Successfully with id:" + responseMessage);
      }
    });
  }

  // Login User Kommunicate
  const loginUserKommunicate = () => {
    const curUser = auth().currentUser;
    const password = `${curUser?.providerData[0].uid}_password` || '123_password';
    const userId = curUser?.email || 'email@gmail.com';

    let kmUser = {
      applicationId: APP_ID,
      userId: userId,
      password: password,
      authenticationTypeId: 1,
      deviceApnsType: 0,
    };


    RNKommunicateChat.loginUser(kmUser, (response, message) => {
      if (response == 'Success') {
        // console.log('loginKommunicateSuccess: ', message);
        setUserLoginId(userId)
      } else if (response == 'Error') {
        console.log('loginKommunicateFailed: ', message);
      }
    });
  };

  const logoutHandle = () => {
    auth().signOut().then(() => navigation.replace('login'))
    RNKommunicateChat.logout((response) => {

    });
  }

  const openChatList = () => {
    RNKommunicateChat.openConversation((response, message) => {
      if (response == 'Error') {
        console.log(message);
      } else {
        //chat screen launched successfully
      }
    });
  }

  const changeProfileHandle = () => {
    navigation.navigate("editProfile", {
      userId: userLoginId
    })
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.root} >
      <View style={styles.avatarContainer} >
        {
          imgUri ? (
            <Image style={styles.avatar} resizeMode='cover' source={{ uri: imgUri }} />
          ) : (
            <Image style={styles.avatar} source={images.fbLoginBtn} resizeMode="cover" />
          )
        }
      </View>
      <Text style={styles.userName}>{userName}</Text>
      <View style={styles.infoContainer} >
        <Text style={styles.leftSideInfoContainer} >Email:</Text>
        <Text style={styles.rightSideInfoContainer} >{userEmail}</Text>
      </View>
      <View style={styles.infoContainer} >
        <Text style={styles.leftSideInfoContainer} >Login type:</Text>
        <Text style={styles.rightSideInfoContainer} >{loginType}</Text>
      </View>
      <Button containerStyle={styles.btn} title='Start chat with list bot' onPress={chatWithListBot} />
      <Button containerStyle={styles.btn} title='Open conversation' onPress={openChatList} />
      <Button containerStyle={styles.btn} title='Change Profile' onPress={changeProfileHandle} />
      <Button containerStyle={styles.btn} title='Logout' onPress={logoutHandle} />
    </SafeAreaView>
  )
}

export default LoginSuccess