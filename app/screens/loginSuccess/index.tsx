import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import { Button } from '../../components'
import { loginSuccessProps } from '../../navigators/type'
import { EnumLoginBy } from '../../utils/enums'
import { getLoginType } from '../../utils/functions'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './styles'
import images from '../../../assets/images'

const LoginSuccess = (props: loginSuccessProps) => {
  const { navigation, route } = props
  const curUser = auth().currentUser
  const loginType: EnumLoginBy = getLoginType(curUser)
  const imgUri = curUser?.photoURL
  const userName = curUser?.displayName || "anonymous"
  const userEmail = curUser?.email || "-"

  const logoutHandle = () => {
    auth().signOut().then(() => navigation.replace('login'))
  }

  const chatWithBot = () => {
    navigation.navigate('chatbot')
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
      <Button containerStyle={styles.btn} title='Chat with bot' onPress={chatWithBot} />
      <Button containerStyle={styles.btn} title='Logout' onPress={logoutHandle} />
    </SafeAreaView>
  )
}

export default LoginSuccess