import { View, Text, ActivityIndicator, TextInput, Image, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles'
import { EditProfileProps } from '../../navigators/type'
import { UserKommunicate } from '../../models'
import { BASE_URL } from '../../utils/functions'
import images from '../../../assets/images'
import { SafeAreaView } from 'react-native-safe-area-context'
import { isEmpty } from 'lodash'
import { Button } from '../../components'

const EditProfileScreen = (props: EditProfileProps) => {
  const { navigation, route } = props
  const userId = route.params.userId

  const [loadingProfile, setLoadingProfile] = useState<boolean>(false)
  const [userDetails, setUserDetails] = useState<UserKommunicate>()
  const [userName, setUserName] = useState<string>()
  const [userEmail, setUserEmail] = useState<string>()

  useEffect(() => {
    getUserDetails()
  }, [])

  const goBackHandle = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const submitEdit = () => {
    let editData = {}
    setLoadingProfile(true)
    if (!isEmpty(userEmail)) {
      editData = {
        ...editData,
        email: userEmail
      }
    }
    if (!isEmpty(userName)) {
      editData = {
        ...editData,
        displayName: userName
      }
    }
    fetch(`${BASE_URL}/rest/ws/user/update `, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': 'No51MQJbiYMAowLgVh6WLInNRnesMbZN',
        'Of-User-Id': userId
      },
      body: JSON.stringify({
        ...editData
      })
    }).then(response => response.json())
      .then(data => {
        const status = data?.status
        console.log("STATUS: ", status);
      }).catch((err) => console.log(err.toString())
      ).finally(() => setLoadingProfile(false))
  }

  const getUserDetails = async () => {
    setLoadingProfile(true)
    fetch(`${BASE_URL}/rest/ws/user/v2/detail `, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': 'No51MQJbiYMAowLgVh6WLInNRnesMbZN',
      },
      body: JSON.stringify({
        userIdList: [userId]
      })
    }).then(response => response.json())
      .then(data => {
        const dataUser = data.response[0]
        console.log('Success:', dataUser);
        const userName = dataUser?.userName
        const userEmail = dataUser?.email
        setUserDetails(userName)
        if (!isEmpty(userName)) {
          setUserName(userName)
        }
        if (!isEmpty(userEmail)) {
          setUserEmail(userEmail?.email)
        }
      }).catch((err) => console.log(err.toString())
      ).finally(() => setLoadingProfile(false))
  }

  if (loadingProfile) {
    return (
      <View style={styles.header} >
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.root} >
      <View style={styles.header} >
        <TouchableOpacity onPress={goBackHandle} style={styles.btnContainer} >
          <Image source={images.backArrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} >Edit profile</Text>
        <View style={styles.btnContainer} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Type name"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Type email"
        value={userEmail}
        onChangeText={setUserEmail}
        keyboardType="email-address"
      />
      <Button
        title='EDIT'
        containerStyle={styles.submitContainer}
        onPress={submitEdit}
      />
    </SafeAreaView>
  )
}

export default EditProfileScreen