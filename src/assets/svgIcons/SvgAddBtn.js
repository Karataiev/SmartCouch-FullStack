import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgAddBtn = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}>
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M10 4.167c.46 0 .833.373.833.833v4.166H15a.833.833 0 0 1 0 1.667h-4.167V15a.833.833 0 1 1-1.666 0v-4.167H5a.833.833 0 0 1 0-1.667h4.167V5c0-.46.373-.833.833-.833Z"
      clipRule="evenodd"
    />
  </Svg>
);
