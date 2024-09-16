import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgBackBtn = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.166 10H5.833m0 0 3.333 3.334M5.833 10l3.333-3.333"
    />
  </Svg>
);
