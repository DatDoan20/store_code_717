import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {customTheme} from '../../theme';
import {Button} from './components/Button';
import images from '../../../assets/images';
import {User, Users} from './dumbData';
import {ItemCard} from './components/itemCard';

const {width, height} = Dimensions.get('window');

export const TinderSwipeScreen: FC = (props: any) => {
  const translateXGlobal = useSharedValue(0);
  const [users, setUsers] = useState<User[]>(Users);

  useEffect(() => {
    if (users.length === 0) {
      setUsers(Users);
    }
  }, [users.length]);

  const onSwiping = (x: number) => {
    translateXGlobal.value = x;
  };

  const handleSwipe = (value?: string) => {
    translateXGlobal.value = 0;
    setUsers((prevState: User[]) => [...prevState.slice(1)]);
  };

  // const rNextCardStyle = useAnimatedStyle(() => {
  //   const scale = interpolate(
  //     translateXGlobal.value,
  //     [-width / 2, 0, width / 2],
  //     [1, 0.8, 1],
  //     Extrapolate.CLAMP,
  //   );

  //   const opacity = interpolate(
  //     translateXGlobal.value,
  //     [-width / 2, 0, width / 2],
  //     [1, 0, 1],
  //     Extrapolate.CLAMP,
  //   );

  //   return {
  //     opacity,
  //     transform: [{scale}],
  //   };
  // });

  const rButtonMatch = useAnimatedStyle(() => {
    const scale = interpolate(
      translateXGlobal.value,
      [0, width / 2],
      [1, 1.5],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{scale}],
    };
  });

  const rButtonClose = useAnimatedStyle(() => {
    const scale = interpolate(
      translateXGlobal.value,
      [-width / 2, 0],
      [1.5, 1],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{scale}],
    };
  });

  const renderUsers = () => {
    // const data = users.reverse();
    return users
      .map((item: User, i: number) => {
        const view = (
          <ItemCard
            key={i}
            item={item}
            onSwiping={onSwiping}
            handleSwiped={handleSwipe}
            index={i}
            rNextCardStyle={{}}
          />
        );
        return view;
      })
      .reverse();
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.root}>
        <View style={styles.container}>{renderUsers()}</View>
        <View style={styles.btnContainer}>
          <Button
            img={images.close}
            btnRStyle={rButtonClose}
            callback={handleSwipe}
          />
          <Button
            img={images.heart}
            btnRStyle={rButtonMatch}
            callback={handleSwipe}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: customTheme.colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: customTheme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerImg: {
    position: 'absolute',
    flex: 1,
    backgroundColor: customTheme.colors.white,
    borderRadius: 20,
  },
  img: {
    height: height / 1.5,
    width: width - 20,
    borderRadius: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
