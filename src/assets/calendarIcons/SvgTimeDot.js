import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
export const SvgTimeDot = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={7}
    height={5}
    fill="none"
    {...props}>
    <Rect width={7} height={5} fill="#FFFF65" rx={2} />
  </Svg>
);
