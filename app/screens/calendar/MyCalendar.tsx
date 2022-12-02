import * as React from 'react';
import {
  View,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import images from '../../res/common_image';
import {type} from '../../utils/fonts';
import {addZeroBeforeString} from '../../utils/formatString';
import {height, specHeight, width} from '../../utils/Scale';
import theme from '../../utils/theme';
import MyImage from '../Image/FastImage';
import MyText from '../text/MyText';

export const addZeroBeforeString = (
  text: string | number,
  size: number,
): string => {
  let value = text.toString();
  while (value.length < size) value = '0' + value;
  return value;
};

export interface MyCalendarProps {
  visible: boolean;
  date: Date;
  txtDate: string;
}

export interface MyCalendarState {
  date: Date;
}

enum TypeEventChangeDate {
  PREV_MONTH,
  NEXT_MONTH,
  PREV_YEAR,
  NEXT_YEAR,
}

export default class MyCalendarComponent extends React.Component<
  MyCalendarProps,
  MyCalendarState
> {
  txtDate: string;
  today: Date = new Date();
  listDate: React.ReactNode[] = [];
  ListMonth: string[] = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];
  ListDay: string[] = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  dateChosen: string = '';
  monthChosen: string = '';
  yearChosen: string = '';

  constructor(props: MyCalendarProps) {
    super(props);
    this.state = {
      date: this.props.date,
    };
    this.txtDate = this.props.txtDate;
  }

  changeDate = (type: TypeEventChangeDate) => {
    if (type === TypeEventChangeDate.NEXT_MONTH) {
      this.state.date.setMonth(this.state.date.getMonth() + 1);
      return;
    }
    if (type === TypeEventChangeDate.PREV_MONTH) {
      this.state.date.setMonth(this.state.date.getMonth() - 1);
      return;
    }
    if (type === TypeEventChangeDate.NEXT_YEAR) {
      this.state.date.setFullYear(this.state.date.getFullYear() + 1);
      return;
    }
    if (type === TypeEventChangeDate.PREV_YEAR) {
      this.state.date.setFullYear(this.state.date.getFullYear() - 1);
      return;
    }
  };

  handleEventChangeDate = (type: TypeEventChangeDate) => {
    this.changeDate(type);
    this.listDate = [];
    this.setState({date: this.state.date});
  };

  getDateChosen() {
    // DD MM YYYY
    const arr = this.txtDate.split('/');
    this.dateChosen = arr[0];
    this.monthChosen = arr[1];
    this.yearChosen = arr[2];
  }

  addDateOfPrevMonth = () => {
    //I
    // Dùng để cộng ngày khi add các ngày của tháng trước vào mảng
    const lastDateOfPrevMonth = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth(),
      0,
    ).getDate();
    // return index của "thứ", thứ 2 return 1, chủ nhật return 0,
    // setDate = 1 -> ngày đầu tiên của tháng -> lấy ra thứ của ngày đầu tiên trong tháng đó
    // => vd. thứ 5 => cần add 4 ngày của tháng trước vào mảng
    const firstDayIndexOfCrrMonth = this.state.date.getDay();

    for (let i = firstDayIndexOfCrrMonth; i > 0; i--) {
      const date = lastDateOfPrevMonth - i + 1;
      const dateFormat = addZeroBeforeString(date, 2);
      const ViewDateOfMonth = this.renderItem(
        dateFormat,
        true,
        styles.textItemDateIsDisabled,
      );
      this.listDate.push(ViewDateOfMonth);
    }
  };

  addDateOfCrrMonth = () => {
    //II lấy ngày cuối cùng của tháng hiện tại
    // date.getMonth() + 1 -> tháng tiếp theo,  0 -> ngày cuối cùng của tháng trước, 1 -> ngày đầu tiên của tháng hiện tại
    // => dùng để add các ngày trong tháng vào mảng
    const lastDateOfCrrMonth = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth() + 1,
      0,
    ).getDate();

    for (let i = 1; i <= lastDateOfCrrMonth; i++) {
      const dateFormat = addZeroBeforeString(i, 2);
      let textItemStyle = styles.textItemDate;
      let bgItem = {};
      // NOTE: i is chosen date
      if (
        i === parseInt(this.dateChosen) &&
        this.state.date.getMonth() + 1 === parseInt(this.monthChosen) &&
        this.state.date.getFullYear() === parseInt(this.yearChosen)
      ) {
        textItemStyle = styles.textItemDateIsChosen;
        bgItem = styles.chosenBgItem;
      }
      //NOTE: i is today
      else if (
        i === new Date().getDate() &&
        this.state.date.getMonth() === new Date().getMonth() &&
        this.state.date.getFullYear() === new Date().getFullYear()
      ) {
        textItemStyle = styles.textItemDateIsToDay;
      }

      this.listDate.push(
        this.renderItem(dateFormat, false, textItemStyle, bgItem),
      );
    }
  };

  addDateOfNextMonth = () => {
    // III
    // lấy thứ của ngày cuối cùng trong tháng
    const lastDayIndexOfCrrMonth = new Date(
      this.state.date.getFullYear(),
      this.state.date.getMonth() + 1,
      0,
    ).getDay();
    // trừ đi số ngày đã có trong tuần -> để trả ra ngày phải add tiếp theo vào calendar
    const nextDays = 7 - lastDayIndexOfCrrMonth - 1;

    for (let i = 1; i <= nextDays; i++) {
      const dateFormat = addZeroBeforeString(i, 2);
      const ViewDateOfMonth = this.renderItem(
        dateFormat,
        true,
        styles.textItemDateIsDisabled,
      );
      this.listDate.push(ViewDateOfMonth);
    }
  };

  calculate = () => {
    this.state.date.setDate(1);
    this.getDateChosen();
    this.addDateOfPrevMonth();
    this.addDateOfCrrMonth();
    this.addDateOfNextMonth();
  };

  renderItem = (
    text: string,
    disabled: boolean,
    textStyle: TextStyle,
    bgItem?: ViewStyle,
  ) => {
    return (
      <TouchableOpacity
        style={styles.containerItem}
        disabled={disabled}
        key={Math.random()}>
        <View style={[styles.defaultBgItem, bgItem]}>
          <MyText textStyle={textStyle} text={text} />
        </View>
      </TouchableOpacity>
    );
  };

  renderBtn = (type: TypeEventChangeDate, image: any) => {
    return (
      <TouchableOpacity
        style={styles.btn}
        onPress={() => this.handleEventChangeDate(type)}>
        <MyImage source={image} style={styles.image} />
      </TouchableOpacity>
    );
  };

  public render() {
    this.calculate();
    const title = `${
      this.ListMonth[this.state.date.getMonth()]
    } - ${this.state.date.getFullYear()}`;

    return (
      <Modal deviceHeight={height + width} isVisible={this.props.visible}>
        <View style={styles.root}>
          <View style={styles.containerTitle}>
            {this.renderBtn(TypeEventChangeDate.PREV_MONTH, images.back)}
            <MyText text={title} textStyle={styles.title} />
            {this.renderBtn(TypeEventChangeDate.NEXT_MONTH, images.next)}
          </View>

          <View style={styles.containerCalendar}>
            {this.ListDay.map(day =>
              this.renderItem(day, true, styles.textItemDay),
            )}
            {this.listDate}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    height: height / 2,
    width: width * 0.9,
    borderRadius: type.spacing[13],
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  title: {
    fontSize: type.sizes[16],
    fontFamily: type.fonts.SVNGilroy[600].normal,
    color: theme.colors.blue3,
  },
  btn: {
    padding: specHeight(type.spacing[10]),
  },
  image: {
    width: specHeight(type.spacing[10]),
    height: specHeight(type.spacing[13]),
  },
  containerCalendar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flex: 1,
  },
  containerItem: {
    width: `${100 / 7}%`,
    height: `${100 / 7}%`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultBgItem: {
    width: specHeight(30),
    height: specHeight(30),
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: specHeight(30) / 2,
  },
  chosenBgItem: {
    backgroundColor: theme.colors.yellow2,
  },
  textItemDay: {
    fontFamily: type.fonts.SVNGilroy[600].normal,
    color: theme.colors.yellow2,
  },
  textItemDate: {
    color: theme.colors.blue3,
  },
  textItemDateIsDisabled: {
    color: theme.colors.other2,
  },
  textItemDateIsChosen: {
    color: theme.colors.white,
    padding: 0,
  },
  textItemDateIsToDay: {
    color: theme.colors.blue1,
  },
});
