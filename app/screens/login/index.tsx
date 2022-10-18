import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Modal, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LoginProps } from '../../navigators/type'
import { styles } from './styles'
import { LoginHeader } from './components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, ButtonGroup, TextInputLogin } from '../../components'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { isEmpty } from 'lodash'
import { onBasicLogin, onFacebookButtonPress, onGoogleButtonPress } from '../../utils/functions'

const LoginScreen = (props: LoginProps) => {
  const { navigation, route } = props

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);

      if (initializing) {
        setInitializing(false);
      }
    });

    return subscriber
  }, []);

  useEffect(() => {
    if (error) Alert.alert("Error", error, [
      {
        text: "OK",
        onPress: () => setError('')
      }
    ])
  }, [error])

  const loginHandle = async () => {
    setLoading(true)
    if (!isEmpty(email) && !isEmpty(password)) {
      onBasicLogin(email, password, setError)
    }
    else {
      setError("Field required")
    }
    setLoading(false)
  }

  const registerHandle = () => {
    navigation.navigate("register")
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

  if (user) {
    setTimeout(() => {
      navigation.replace("loginSuccess")
    }, 500)
    return <></>
  }

  if (initializing) return null

  return (
    <SafeAreaView edges={["top"]} style={styles.root} >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.root}
        scrollEventThrottle={16}
      >
        <KeyboardAvoidingView style={styles.root} >
          <LoginHeader />
          <View style={styles.body} >
            <TextInputLogin
              setValue={setEmail}
              value={email}
              placeholder="Enter your email"
              placeholderTextColor="#8391A1"
              style={styles.inputContainer}
              autoCapitalize="none"
              keyboardType='email-address'
            />
            <TextInputLogin
              secureTextEntry
              setValue={setPassword}
              value={password}
              placeholderTextColor="#8391A1"
              style={styles.inputContainer}
              placeholder="Enter your password"
              autoCapitalize='none'
            />
            <TouchableOpacity style={styles.forgotPassContainer} >
              <Text style={styles.forgotPassText} >Forgot Password?</Text>
            </TouchableOpacity>
            <Button
              title='Login'
              containerStyle={styles.btn}
              onPress={loginHandle}
            />
            <ButtonGroup
              onPressFB={fbLoginHandle}
              onPressGG={googleLoginHandle}
            />
            <TouchableOpacity onPress={registerHandle} style={styles.forgetAccountContainer} >
              <Text style={styles.noAccountText} >Don't have an account? <Text style={styles.registText} >Register Now</Text></Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Modal
        visible={loading}
        animationType="slide"
        transparent={true}
      >
        <View style={{ justifyContent: "center", alignItems: "center", padding: 24 }}  >
          <View style={{
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }} >
            <ActivityIndicator />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default LoginScreen