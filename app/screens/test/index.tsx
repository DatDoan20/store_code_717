import * as React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {customTheme} from '../../theme';
import BtnClassTestComponent from './btn';

export interface TestClassProps {}

export interface TestClassState {
  count: number;
}

export default class TestClassScreen extends React.Component<
  TestClassProps,
  TestClassState
> {
  constructor(props: TestClassProps) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  incrementCount() {
    console.log(this.state.count); // 0
    this.setState({count: this.state.count + 1});
  }

  componentDidMount(): void {
    console.log('Parent did mount');
  }

  shouldComponentUpdate(
    nextProps: Readonly<TestClassProps>, // navigate, pop, goBack, ...etc (props was passed by navigator when navigate open this creen)
    nextState: Readonly<TestClassState>, // {count: 1}
    nextContext: any, // {}
  ): boolean {
    console.log('shouldComponentUpdate Parent - nextState', nextState);
    return true;
  }

  componentDidUpdate(
    prevProps: Readonly<TestClassProps>, // navigate, pop, goBack, ...etc (props was passed by navigator when navigate open this creen)
    prevState: Readonly<TestClassState>, // {count: 0}
    snapshot?: any, // undefined
  ): void {
    console.log('componentDidUpdate Parent - prevState', prevState);
  }

  public render() {
    return (
      <View style={styles.root}>
        <Text style={styles.text}>number: {this.state.count}</Text>
        <BtnClassTestComponent
          callback={this.incrementCount.bind(this)}
          count={this.state.count}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: customTheme.colors.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: customTheme.colors.black,
  },
});
