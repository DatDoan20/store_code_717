import moment from 'moment';
import {
  ItemCalendar,
  PageCalendar,
} from '../teacher_screens/timetable/components/type';
import {getString} from './GetString';

export const textDayENG = (textDayENG: string) => {
  let textFormated = '';
  switch (textDayENG) {
    case 'Day 2':
      textFormated = 'Mon';
      break;
    case 'Day 3':
      textFormated = 'Tue';
      break;
    case 'Day 4':
      textFormated = 'Wed';
      break;
    case 'Day 5':
      textFormated = 'Thu';
      break;
    case 'Day 6':
      textFormated = 'Fri';
      break;
    case 'Day 7':
      textFormated = 'Sat';
      break;
    default:
      textFormated = textDayENG;
      break;
  }
  return textFormated;
};

export const textDayVN = (textDayVN: string) => {
  const textFormated = textDayVN.replace('Thứ ', 'T');
  return textFormated;
};

export const formatTextDay = (textDay: string) => {
  if (textDay.includes('Day')) {
    return textDayENG(textDay);
  }
  return textDayVN(textDay);
};

export const getMonday = (d: Date) => {
  const date: Date = d;
  const day = date.getDay();
  const diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export const isMonDay = (textDay: string) => {
  if (
    textDay === 'Thứ 2' ||
    textDay === 'Day 2' ||
    textDay === 'T2' ||
    textDay === 'T 2'
  ) {
    return true;
  }
  return false;
};

// ex. generateItem(0) is current day/date
export const generateItem = (num: number): ItemCalendar => {
  // take point monday to get last week and next week
  const monday = getMonday(new Date());
  const day = parseInt(moment(monday).add(num, 'days').format('d')) + 1;
  const date = moment(monday).add(num, 'days').format('YYYY-MM-DD');
  //
  const textDay = getString('TEACHER_ATTENDANCE_DAY') + ' ' + day;
  return {
    // CN : Thứ/Day/T
    day: day === 1 ? getString('SUNDAY') : formatTextDay(textDay),
    date: date,
  };
};

export const generateCalendar = () => {
  const dataCalendar: PageCalendar[] = [
    {data: []},
    {data: []},
    {data: []},
    {data: []},
  ];
  let numberPager = -1;
  for (let index = -14; index <= 13; index++) {
    const itemCalendar = generateItem(index);
    if (isMonDay(itemCalendar.day)) {
      numberPager += 1;
    }
    dataCalendar[numberPager].data.push(itemCalendar);
  }
  return dataCalendar;
};
