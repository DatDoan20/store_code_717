import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LoginProps } from '../../navigators/type'
import { styles } from './styles'
import { LoginHeader } from './components'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, ButtonGroup, TextInputLogin } from '../../components'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { isEmpty } from 'lodash'
import { AccessToken, LoginManager } from 'react-native-fbsdk-next'

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
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          setError('User account signed in!');
        })
        .catch(error => {
          setError(error.toString());
        });
    }
    else {
      setError("Field required")
    }
    setLoading(false)
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  const fbLoginHandle = () => {
    onFacebookButtonPress().then(() => setError("Login success")).catch((err) => setError(err.toString()))
  }

  if (user) {
    navigation.replace("loginSuccess")
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
          <View style={styles.space} />
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
            <ButtonGroup onPressFB={fbLoginHandle} />
            <TouchableOpacity style={styles.forgetAccountContainer} >
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