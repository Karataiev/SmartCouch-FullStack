import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgArrowRightYellow = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={6}
    height={10}
    fill="none"
    {...props}>
    <Path
      fill="#FFFF65"
      fillRule="evenodd"
      d="M.293.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4A1 1 0 0 1 .293 8.293L3.586 5 .293 1.707a1 1 0 0 1 0-1.414Z"
      clipRule="evenodd"
    />
  </Svg>
);
