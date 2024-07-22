import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgArrowDown = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={6}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 1 5 5 1 1"
    />
  </Svg>
);
