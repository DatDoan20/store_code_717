import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
  useDerivedValue,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {customTheme} from '../../theme';
import {Users} from './dumbData';
import {Button} from './components/Button';
import images from '../../../assets/images';

const {width, height} = Dimensions.get('window');

export const TinderSwipeScreen: FC = (props: any) => {
  const translateX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  console.log(currentIndex);
  const updateCurrentIndex = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context: any) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX;
    },
    onEnd: (event, context) => {
      if (translateX.value > width / 2) {
        translateX.value = width + 100;
        runOnJS(updateCurrentIndex)();
        return;
      }
      if (translateX.value < -width / 2) {
        translateX.value = -width - 100;
        runOnJS(updateCurrentIndex)();
        return;
      }
      translateX.value = withSpring(0);
    },
  });

  useEffect(() => {
    // if (currentIndex !== 0) {
    //   setTimeout(() => {
    //     translateX.value = withSpring(0);
    //   }, 5000);
    // }
  }, [currentIndex]);

  const rCard = useAnimatedStyle(() => {
    translateX.value = withSpring(0);
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        {translateX: translateX.value},
        // {translateY: translateY.value},
        {rotate: `${rotate}deg`},
      ],
    };
  });

  const rNextCard = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [1, 0.8, 1],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [1, 0, 1],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
      transform: [{scale}],
    };
  });

  const rButtonMatch = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
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
      translateX.value,
      [-width / 2, 0],
      [1.5, 1],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{scale}],
    };
  });

  const renderUsers = () => {
    return Users.map((item, i) => {
      if (i < currentIndex) {
        return null;
      }
      if (i === currentIndex) {
        return (
          <PanGestureHandler onGestureEvent={gestureHandler} key={item.id}>
            <Animated.View style={[styles.containerImg, rCard]}>
              <Image
                style={[styles.img]}
                resizeMode={'cover'}
                source={item.uri}
              />
            </Animated.View>
          </PanGestureHandler>
        );
      } else {
        return (
          <Animated.View style={[styles.containerImg, rNextCard]} key={item.id}>
            <Image
              style={[styles.img]}
              resizeMode={'cover'}
              source={item.uri}
            />
          </Animated.View>
        );
      }
    }).reverse();
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.root}>
        <View style={styles.container}>{renderUsers()}</View>
        <View style={styles.btnContainer}>
          <Button img={images.close} btnRStyle={rButtonClose} />
          <Button img={images.heart} btnRStyle={rButtonMatch} />
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
function useStates<T>(arg0: number): [any, any] {
  throw new Error('Function not implemented.');
}
