import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: 'black',
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 28,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'black',
  },
  input: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 24,
    paddingHorizontal: 12,
    marginTop: 24,
  },
  submitContainer: {
    marginTop: 'auto',
    marginBottom: 24,
    marginHorizontal: 24,
  },
});
