import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {generateCalendar} from './DayHandle';
import Swiper from 'react-native-swiper';
import {MyText} from '../myText/MyText';
interface Props {}

interface State {}

export interface ItemCalendar {
  day: string; // T2 / Thứ 2 / Mon
  date: string; // YYYY-MM-DD
}
export interface PageCalendar {
  data: ItemCalendar[];
}

export default class CalendarFollowWeek extends React.Component<Props, State> {
  dataCalendar = generateCalendar();
  currentYYYYMMDD = moment().startOf('day');
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  renderCalendar = (item: PageCalendar, index: number) => {
    return (
      <View key={index} style={styles.page}>
        {item.data.map((item: ItemCalendar, index: number) => {
          const result = this.currentYYYYMMDD.diff(item.date, 'days');
          let changeBg = {};
          if (result === 0) {
            changeBg = styles.bgTextDateIsToday;
          } else if (result > 0) {
            changeBg = styles.bgTextDateIsPast;
          }
          return (
            <View key={index} style={styles.containerItem}>
              <MyText textStyle={styles.textDay} text={item.day} />
              <TouchableOpacity style={[styles.bgTextDate, changeBg]}>
                <MyText
                  textStyle={styles.textDate}
                  text={item.date.split('-')[2]}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  public render() {
    return (
      <View>
        <Swiper
          index={2}
          loop={false}
          style={styles.wrapCalendar}
          showsButtons={true}
          showsPagination={false}>
          {this.dataCalendar.map((item, index) =>
            this.renderCalendar(item, index),
          )}
        </Swiper>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  //calendar handmade
  wrapCalendar: {
    // don't use width, if use width -> can not scroll and click next page
    height: width * 0.25,
  },
  page: {
    width: width,
    height: width * 0.25,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: specHeight(30),
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: theme.colors.blue1,
  },
  containerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDay: {
    color: theme.colors.yellow2,
    fontSize: textFontSize14,
    fontFamily: type.fonts.SVNGilroy[600].normal,
  },
  bgTextDate: {
    width: specHeight(30),
    height: specHeight(30),
    backgroundColor: theme.colors.other5,
    borderRadius: specHeight(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: specHeight(10),
    opacity: 0.8,
  },
  bgTextDateIsToday: {
    backgroundColor: theme.colors.yellow2,
  },
  bgTextDateIsPast: {
    backgroundColor: theme.colors.other3,
  },
  textDate: {
    color: theme.colors.blue3,
    fontSize: textFontSize14,
    fontFamily: type.fonts.SVNGilroy[400].normal,
  },
});

const specHeight = h => ((height * 1) / 14) * (h / 60); // use when app in portrait
const specWidth = h => ((width * 1) / 14) * (h / 30); // use when app in landscape
//10202
const textFontSize8 =
  height < 814
    ? specHeight(9)
    : height < 846
    ? specHeight(8)
    : height < 894
    ? specHeight(10)
    : height < 1100
    ? specHeight(8)
    : specHeight(10);

const textFontSize9 =
  height < 814
    ? specHeight(10)
    : height < 846
    ? specHeight(9)
    : height < 894
    ? specHeight(11)
    : height < 1100
    ? specHeight(9)
    : specHeight(11);

const textFontSize10 =
  height < 814
    ? specHeight(11)
    : height < 846
    ? specHeight(10)
    : height < 894
    ? specHeight(12)
    : height < 1100
    ? specHeight(10)
    : specHeight(12);

const textFontSize11 =
  height < 814
    ? specHeight(12)
    : height < 846
    ? specHeight(11)
    : height < 894
    ? specHeight(13)
    : height < 1100
    ? specHeight(11)
    : specHeight(13);

const textFontSize12 =
  height < 814
    ? specHeight(13)
    : height < 846
    ? specHeight(12)
    : height < 894
    ? specHeight(14)
    : height < 1100
    ? specHeight(12)
    : specHeight(14);

const textFontSize13 =
  height < 814
    ? specHeight(14)
    : height < 846
    ? specHeight(13)
    : height < 894
    ? specHeight(15)
    : height < 1100
    ? specHeight(13)
    : specHeight(15);

const textFontSize14 =
  height < 814
    ? specHeight(15)
    : height < 846
    ? specHeight(14)
    : height < 894
    ? specHeight(16)
    : height < 1100
    ? specHeight(14)
    : specHeight(16);

const textFontSize15 =
  height < 814
    ? specHeight(16)
    : height < 846
    ? specHeight(15)
    : height < 894
    ? specHeight(17)
    : height < 1100
    ? specHeight(15)
    : specHeight(17);

const textFontSize16 =
  height < 814
    ? specHeight(17)
    : height < 846
    ? specHeight(16)
    : height < 894
    ? specHeight(18)
    : height < 1100
    ? specHeight(16)
    : specHeight(18);

const textFontSize18 =
  height < 814
    ? specHeight(19)
    : height < 846
    ? specHeight(18)
    : height < 894
    ? specHeight(20)
    : height < 1100
    ? specHeight(18)
    : specHeight(20);

const textFontSize20 =
  height < 814
    ? specHeight(21)
    : height < 846
    ? specHeight(20)
    : height < 894
    ? specHeight(22)
    : height < 1100
    ? specHeight(20)
    : specHeight(22);

const textFontSize22 =
  height < 814
    ? specHeight(23)
    : height < 846
    ? specHeight(22)
    : height < 894
    ? specHeight(24)
    : height < 1100
    ? specHeight(22)
    : specHeight(24);

const textFontSize24 =
  height < 814
    ? specHeight(25)
    : height < 846
    ? specHeight(24)
    : height < 894
    ? specHeight(26)
    : height < 1100
    ? specHeight(24)
    : specHeight(26);

const textFontSize25 =
  height < 814
    ? specHeight(26)
    : height < 846
    ? specHeight(25)
    : height < 894
    ? specHeight(27)
    : height < 1100
    ? specHeight(25)
    : specHeight(27);

const textFontSize28 =
  height < 814
    ? specHeight(29)
    : height < 846
    ? specHeight(28)
    : height < 894
    ? specHeight(30)
    : height < 1100
    ? specHeight(28)
    : specHeight(30);

const textFontSize30 =
  height < 814
    ? specHeight(31)
    : height < 846
    ? specHeight(30)
    : height < 894
    ? specHeight(32)
    : height < 1100
    ? specHeight(30)
    : specHeight(32);
