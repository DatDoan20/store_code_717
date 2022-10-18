import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles'
import { RegisterProps } from '../../navigators/type'
import { RegisterHeader } from './components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, ButtonGroup, TextInputLogin } from '../../components'
import { onBasicRegister, onFacebookButtonPress, onGoogleButtonPress } from '../../utils/functions'
import { isEmpty } from 'lodash'

const RegisterScreen = (props: RegisterProps) => {
  const { navigation, route } = props

  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (error) Alert.alert("Error", error, [
      {
        text: "OK",
        onPress: () => setError('')
      }
    ])
  }, [error])

  const registerHandle = () => {
    if (isEmpty(username) || isEmpty(email) || isEmpty(password) || (password !== confirmPassword)) {
      setError("Field required")
    }
    else {
      onBasicRegister({ email, password, setError, username })
    }
  }

  const goBackHandle = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const fbLoginHandle = () => {
    if (Platform.OS === "android") {
      onFacebookButtonPress().then(() => console.log("Login success")).catch((err) => setError(err.toString()))
    }
    else {
      setError("This feature is only support in android platform")
    }
  }

  const googleLoginHandle = () => {
    if (Platform.OS === "android") {
      onGoogleButtonPress().then(() => console.log("Login success")).catch((err) => setError(err.toString()))
    }
    else {
      setError("This feature is only support in android platform")
    }
  }

  return (
    <SafeAreaView style={styles.root} >
      <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false} style={styles.root} >
        <KeyboardAvoidingView style={styles.root} >
          <RegisterHeader goBackHandle={goBackHandle} />
          <View style={styles.body} >
            <TextInputLogin
              setValue={setUsername}
              value={username}
              placeholder="Username"
              placeholderTextColor="#8391A1"
              style={styles.inputContainer}
              autoCapitalize="none"
              keyboardType='name-phone-pad'
            />
            <TextInputLogin
              setValue={setEmail}
              value={email}
              placeholderTextColor="#8391A1"
              style={styles.inputContainer}
              placeholder="Email"
              autoCapitalize='none'
              keyboardType='email-address'
            />
            <TextInputLogin
              secureTextEntry
              setValue={setPassword}
              value={password}
              placeholderTextColor="#8391A1"
              style={styles.inputContainer}
              placeholder="Password"
              autoCapitalize='none'
            // keyboardType='visible-password'
            />
            <TextInputLogin
              secureTextEntry
              setValue={setConfirmPassword}
              value={confirmPassword}
              placeholderTextColor="#8391A1"
              style={styles.inputContainer}
              placeholder="Confirm password"
              autoCapitalize='none'
            // keyboardType='visible-password'
            />
            <Button
              title='Register'
              containerStyle={styles.btn}
              onPress={registerHandle}
            />
            <ButtonGroup
              onPressFB={fbLoginHandle}
              onPressGG={googleLoginHandle}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RegisterScreen