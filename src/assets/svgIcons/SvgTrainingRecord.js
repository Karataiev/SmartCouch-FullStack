import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgTrainingRecord = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}>
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10Z"
      clipRule="evenodd"
    />
  </Svg>
);
