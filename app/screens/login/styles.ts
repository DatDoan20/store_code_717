import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleHeader: {
    color: '#fdac36',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 39,
    marginLeft: 40,
  },
  headerContainer: {
    marginTop: width / 7,
  },
  imgHeader1: {
    width: width,
    height: width,
    position: 'absolute',
    top: 0,
    resizeMode: 'contain',
  },
  imgHeader2: {
    width: width / 1.4,
    height: width / 1.4,
    alignSelf: 'flex-end',
    zIndex: 10,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginTop: 24,
  },
  body: {
    marginHorizontal: 40,
    flex: 1,
  },
  forgotPassContainer: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  forgotPassText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    color: '#5874AC',
  },
  btn: {
    marginVertical: 24,
  },
  forgetAccountContainer: {
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  noAccountText: {
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 21,
    color: 'black',
  },
  registText: {
    fontWeight: '500',
    color: '#FF8A14',
  },
});
