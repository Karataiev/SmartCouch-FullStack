import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgArrowUp = props => (
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
      d="m1 5 4-4 4 4"
    />
  </Svg>
);
