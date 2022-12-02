import * as React from 'react';
import {StyleProp} from 'react-native';
import FastImage, {
  ImageStyle,
  ResizeMode,
  Source,
} from 'react-native-fast-image';

export interface MyImageProps {
  source: Source | number;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
  tintColor?: string;
}

export interface MyImageState {}

export default class MyImage extends React.Component<
  MyImageProps,
  MyImageState
> {
  constructor(props: MyImageProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const {source, style, resizeMode, tintColor} = this.props;
    return (
      <FastImage
        style={style}
        source={source}
        resizeMode={resizeMode || FastImage.resizeMode.contain}
        tintColor={tintColor}
      />
    );
  }
}
