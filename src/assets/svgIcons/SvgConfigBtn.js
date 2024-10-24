import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgConfigBtn = props => (
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
      d="M9.166 15a.833.833 0 1 0 1.667 0 .833.833 0 0 0-1.667 0ZM9.166 10a.833.833 0 1 0 1.667 0 .833.833 0 0 0-1.667 0ZM9.166 5a.833.833 0 1 0 1.667 0 .833.833 0 0 0-1.667 0Z"
    />
  </Svg>
);
