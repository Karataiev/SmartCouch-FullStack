import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgPlus = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      fill="#111"
      fillRule="evenodd"
      d="M12 2.666a9.333 9.333 0 1 0 0 18.667 9.333 9.333 0 0 0 0-18.667ZM.333 12C.333 5.556 5.557.333 12 .333S23.667 5.556 23.667 12c0 6.443-5.224 11.666-11.667 11.666S.333 18.443.333 12ZM12 6.166c.644 0 1.167.523 1.167 1.167v3.5h3.5a1.167 1.167 0 0 1 0 2.333h-3.5v3.5a1.167 1.167 0 1 1-2.334 0v-3.5h-3.5a1.167 1.167 0 1 1 0-2.333h3.5v-3.5c0-.644.523-1.167 1.167-1.167Z"
      clipRule="evenodd"
    />
  </Svg>
);
