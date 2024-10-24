import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgSearch = props => (
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
      d="m12.5 12.5 5 5m-9.167-3.333a5.833 5.833 0 1 1 0-11.667 5.833 5.833 0 0 1 0 11.667Z"
    />
  </Svg>
);
