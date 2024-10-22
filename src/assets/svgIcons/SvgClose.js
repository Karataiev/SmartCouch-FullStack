import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgClose = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}>
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M1.175 1.175a1.167 1.167 0 0 1 1.65 0L9 7.35l6.175-6.175a1.167 1.167 0 1 1 1.65 1.65L10.65 9l6.175 6.175a1.167 1.167 0 0 1-1.65 1.65L9 10.65l-6.175 6.175a1.167 1.167 0 1 1-1.65-1.65L7.35 9 1.175 2.825a1.167 1.167 0 0 1 0-1.65Z"
      clipRule="evenodd"
    />
  </Svg>
);
