import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 32,
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    width: width / 2.5,
    height: width / 2.5,
    borderRadius: width / 2.5,
    borderColor: 'blue',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userName: {
    marginVertical: 12,
    fontWeight: '700',
    fontSize: 29,
    lineHeight: 39.5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  leftSideInfoContainer: {
    flex: 1,
    color: 'grey',
  },
  rightSideInfoContainer: {
    color: 'black',
    fontWeight: '600',
    flex: 2,
  },
  btn: {
    marginTop: 'auto',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    aspectRatio: 1 / 1,
  },
});
