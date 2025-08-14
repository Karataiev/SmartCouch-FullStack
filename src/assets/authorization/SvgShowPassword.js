import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgShowPassword = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={12}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1.99 7.482C3.471 8.957 6.057 11 9 11c2.943 0 5.528-2.043 7.011-3.518.391-.388.587-.584.712-.965a2.038 2.038 0 0 0 0-1.034c-.125-.381-.32-.577-.712-.965C14.528 3.043 11.943 1 9.001 1 6.057 1 3.471 3.043 1.988 4.518c-.391.389-.587.583-.711.965a2.037 2.037 0 0 0 0 1.034c.124.382.32.576.711.965Z"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7.334 6a1.667 1.667 0 1 0 3.333 0 1.667 1.667 0 0 0-3.333 0Z"
    />
  </Svg>
);
