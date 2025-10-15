import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgCancelIcon = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={9}
    fill="none"
    {...props}>
    <Path
      fill="#B95151"
      fillRule="evenodd"
      d="M.308.308a.625.625 0 0 1 .884 0L4.5 3.616 7.808.308a.625.625 0 1 1 .884.884L5.384 4.5l3.308 3.308a.625.625 0 1 1-.884.884L4.5 5.384 1.192 8.692a.625.625 0 1 1-.884-.884L3.616 4.5.308 1.192a.625.625 0 0 1 0-.884Z"
      clipRule="evenodd"
    />
  </Svg>
);
