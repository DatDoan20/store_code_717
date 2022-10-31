import * as React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {customTheme} from '../../theme';

export interface BtnClassTestProps {
  callback(): void;
  count: number;
}

export default class BtnClassTestComponent extends React.Component<
  BtnClassTestProps,
  any
> {
  constructor(props: BtnClassTestProps) {
    super(props);
  }

  componentDidMount(): void {
    console.log('child did mount');
  }

  shouldComponentUpdate(
    nextProps: Readonly<BtnClassTestProps>,
    nextState: Readonly<any>,
    nextContext: any,
  ): boolean {
    console.log('shouldComponentUpdate child - nextProps', nextProps);
    console.log('shouldComponentUpdate child - nextState', nextState);

    return nextProps.count % 2 === 0 ? true : false;
  }

  componentDidUpdate(
    prevProps: Readonly<BtnClassTestProps>,
    prevState: Readonly<any>,
    snapshot?: any,
  ): void {
    console.log('componentDidUpdate child - prevProps', prevProps);
    console.log('componentDidUpdate child - prevState', prevState);
  }

  public render() {
    return (
      <TouchableOpacity style={styles.btn} onPress={this.props.callback}>
        <Text style={styles.text}>Click increment {this.props.count}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: customTheme.colors.black_10_percent,
  },
  text: {
    color: customTheme.colors.black,
  },
});
