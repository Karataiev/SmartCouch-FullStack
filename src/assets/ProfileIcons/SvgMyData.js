import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgMyData = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={17}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16c0-2.21-2.686-4-6-4s-6 1.79-6 4m6-7a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
    />
  </Svg>
);
