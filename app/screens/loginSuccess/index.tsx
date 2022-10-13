import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import { Button } from '../../components'
import { loginSuccessProps } from '../../navigators/type'

const LoginSuccess = (props: loginSuccessProps) => {
  const { navigation, route } = props
  const curUser = auth().currentUser

  const logoutHandle = () => {
    auth().signOut().then(() => navigation.replace('login'))
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
      <Text>{`Hello ${curUser?.email}`}</Text>
      <Button title='Log out' onPress={logoutHandle} />
    </View>
  )
}

export default LoginSuccess