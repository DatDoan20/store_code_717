import React, {useEffect} from 'react';
import {StyleSheet, Image, Dimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {customTheme} from '../../../theme';
import {User} from '../dumbData';

const {width, height} = Dimensions.get('window');

interface ItemCard {
  item: User;
  onSwiping: (x: number) => void;
  handleSwiped: (direction?: string) => void;
  index: number;
  rNextCardStyle: {};
  value?: number;
}
export const ItemCard = (props: ItemCard) => {
  const {
    item,
    onSwiping,
    handleSwiped,
    index,
    rNextCardStyle,
    value = 0,
  } = props;
  const translateX = useSharedValue(value);
  console.log(item.id, '=', translateX.value);

  const handleOnEnd = () => {
    translateX.value = withSpring(0);
    handleSwiped();
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context: any) => {},
    onActive: (event, context) => {
      translateX.value = event.translationX;
      runOnJS(onSwiping)(event.translationX);
    },
    onEnd: (event, context) => {
      if (translateX.value > 120) {
        translateX.value = withSpring(width + 100, undefined);
        console.log(item.id, '=', translateX.value);
        runOnJS(handleOnEnd)();
        return;
      }
      if (translateX.value < -120) {
        translateX.value = withSpring(-width - 100);
        runOnJS(handleOnEnd)();
        return;
      }
      translateX.value = withSpring(0);
    },
  });

  const rCard = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateX: translateX.value}, {rotate: `${rotate}deg`}],
    };
  });

  if (index === 0) {
    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.containerImg, rCard]}>
          <Image style={[styles.img]} resizeMode={'cover'} source={item.uri} />
        </Animated.View>
      </PanGestureHandler>
    );
  } else {
    return (
      <Animated.View style={[styles.containerImg, rNextCardStyle]}>
        <Image style={[styles.img]} resizeMode={'cover'} source={item.uri} />
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
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
});
