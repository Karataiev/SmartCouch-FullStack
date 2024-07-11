import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgProfile = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 19c0-2.761-3.582-5-8-5s-8 2.239-8 5m8-8A5 5 0 1 1 9 1a5 5 0 0 1 0 10Z"
    />
  </Svg>
);
