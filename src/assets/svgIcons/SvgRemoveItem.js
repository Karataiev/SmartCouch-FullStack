import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgRemoveItem = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={10}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.334 8.334 5 5m0 0L1.667 1.667M5 5l3.334-3.333M5 5 1.667 8.334"
    />
  </Svg>
);
