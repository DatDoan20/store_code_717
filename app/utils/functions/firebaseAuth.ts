import {EnumLoginBy} from './../enums/index';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import firestore from '@react-native-firebase/firestore';

// Register basic
export async function onBasicRegister({
  email,
  password,
  setError,
  username,
}: {
  email: string;
  password: string;
  username: string;
  setError: (err: string) => void;
}) {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      firestore()
        .collection('Users')
        .add({
          username,
          email,
          loginBy: EnumLoginBy.BASIC,
        })
        .catch(err => new Error(err));
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        setError('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        setError('That email address is invalid!');
      } else {
        setError(error + '');
      }
    });
}

// Basic
export async function onBasicLogin(
  email: string,
  password: string,
  setError: (err: string) => void,
) {
  await auth()
    .signInWithEmailAndPassword(email, password)
    .catch(error => {
      setError(error.toString());
    });
}

// Facebook
export async function onFacebookButtonPress() {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);
  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }
  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();
  if (!data) {
    throw 'Something went wrong obtaining access token';
  }
  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );
  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential);
}

// Google
GoogleSignin.configure({
  webClientId:
    '122628850719-1cr15cc1tt26o13t6mra9d8f9nj8ptgc.apps.googleusercontent.com',
});

export async function onGoogleButtonPress() {
  // Get the users ID token
  const userInfor = await GoogleSignin.signIn();

  const {idToken} = userInfor;
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}
