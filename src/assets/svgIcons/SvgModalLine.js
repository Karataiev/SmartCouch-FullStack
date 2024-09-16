import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
export const SvgModalLine = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={5}
    fill="none"
    {...props}>
    <Rect width={40} height={5} fill="#fff" rx={2.5} />
  </Svg>
);
