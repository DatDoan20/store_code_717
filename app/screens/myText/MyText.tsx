import React from 'react';
import {StyleSheet, Text, StyleProp, TextStyle} from 'react-native';
import {type} from '../../utils/fonts';
import theme from '../../utils/theme';

//rnss, tsrc

export interface MyTextProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  children?: React.ReactNode;
}

export interface MyTextState {}

export class MyText extends React.Component<MyTextProps, MyTextState> {
  constructor(props: MyTextProps) {
    super(props);
  }

  public render() {
    const {textStyle, text, numberOfLines, children} = this.props;
    return (
      <Text
        allowFontScaling={false}
        style={[styles.text, textStyle]}
        numberOfLines={numberOfLines || 1}>
        {text}
        {children}
      </Text>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    fontSize: type.sizes[14],
    fontFamily: type.fonts.SVNGilroy[400].normal,
    color: theme.colors.black,
  },
});
