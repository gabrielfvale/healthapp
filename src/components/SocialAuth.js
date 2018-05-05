import React, { Component } from 'react';
import {  
  StyleSheet, 
  View, 
  Text, 
  TouchableNativeFeedback, 
  Image, 
  ToastAndroid
} from 'react-native';
import { dimensions, padding } from '../../styles/theme';
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

const GoogleLogin = async () => {
  try {
    await GoogleSignin.configure();
    const data = await GoogleSignin.signIn();
    // Cria uma credencial no firebase com o token
    const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
    // Login com a credencial
    const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
    console.info(JSON.stringify(currentUser.user.toJSON()));
  } catch (e) {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  }
}
const FacebookLogin = async () => {
  try {
    const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw new Error('User cancelled request'); //TODO
    }
    console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
    // Token de acesso
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Something went wrong obtaining the users access token'); // Handle this however fits the flow of your app
    }
    // Cria uma credencial no firebase com o token
    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
    // Login com a credencial
    const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
    console.info(JSON.stringify(currentUser.user.toJSON()))
  } catch (e) {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  }
}

export default class SocialAuth extends Component {
  render() {
    let iconPath = '../images/';
    return (
    <View style={{flexDirection: 'row', justifyContent: 'center',}}>
      <TouchableNativeFeedback
        onPress={() => GoogleLogin()}
        background={TouchableNativeFeedback.Ripple('gray', true)}>
        <View style={[styles.btnWrapper, {backgroundColor: 'white'}]}>
          <Image style={styles.image} source={require(iconPath + 'google.png')}/>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => FacebookLogin()}
        background={TouchableNativeFeedback.Ripple('#3b5998', true)}>
        <View style={[styles.btnWrapper, {backgroundColor: '#3b5998'}]}>
          <Image style={styles.image} source={require(iconPath + 'facebook.png')}/>
        </View>
      </TouchableNativeFeedback>
    </View>
    );
  }
}
const styles = new StyleSheet.create({
  image: {
    width: dimensions.icon_std,
    height: dimensions.icon_std
  },
  btnWrapper: {
    borderRadius: 56,
    width: dimensions.btn_std,
    height: dimensions.btn_std,
    alignItems: 'center',
    justifyContent: 'center',
    margin: padding.sm,
    elevation: 1,
    },
});
