import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgSchedule = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={21}
    fill="none"
    {...props}>
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M6 1a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm9.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414ZM9 5a7 7 0 1 0 0 14A7 7 0 0 0 9 5Zm-9 7a9 9 0 1 1 18 0 9 9 0 0 1-18 0Zm9-5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z"
      clipRule="evenodd"
    />
  </Svg>
);
