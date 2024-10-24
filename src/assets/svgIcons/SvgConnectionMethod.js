import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgConnectionMethod = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m6.5 10.25 5 2.5m0-7.5-5 2.5M14 16.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm-10-5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm10-5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
    />
  </Svg>
);
