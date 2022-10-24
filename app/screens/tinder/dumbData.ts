import images from '../../../assets/images';

export type User = {
  id: string;
  uri: any;
};

export const Users: User[] = [
  {id: '1', uri: images.thumbnail_1},
  {id: '2', uri: images.thumbnail_2},
  {id: '3', uri: images.thumbnail_3},
  {id: '4', uri: images.thumbnail_4},
  {id: '5', uri: images.thumbnail_5},
];
