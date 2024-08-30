import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgDoneStatus = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={7}
    fill="none"
    {...props}>
    <Path
      fill="#00CA8D"
      fillRule="evenodd"
      d="M9.146.406a.625.625 0 0 1 0 .884L3.844 6.594a.625.625 0 0 1-.884 0L.308 3.942a.625.625 0 1 1 .884-.884l2.21 2.21L8.262.406a.625.625 0 0 1 .884 0Z"
      clipRule="evenodd"
    />
  </Svg>
);
