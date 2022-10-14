import {EnumButtonGroup} from './../../../utils/enums/index';
import {ImageSourcePropType} from 'react-native';
import images from '../../../../assets/images';

export interface IconButtonInterface {
  img: ImageSourcePropType;
  key: EnumButtonGroup;
}

export const ButtonGroupData: IconButtonInterface[] = [
  {
    img: images.fbLoginBtn,
    key: EnumButtonGroup.FACEBOOK,
  },
  {
    img: images.twitterLoginBtn,
    key: EnumButtonGroup.TWITTER,
  },
  {
    img: images.googleLoginBtn,
    key: EnumButtonGroup.GOOGLE,
  },
];
