import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgWatch = props => (
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
      d="M9 4.833V9h4.167M9 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
    />
  </Svg>
);
