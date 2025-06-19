import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgRemoveBtn = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    {...props}>
    <Path
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 8v7M7 8v7M3 4v11.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h5.606c1.118 0 1.677 0 2.104-.218.377-.192.684-.498.875-.874.218-.428.218-.987.218-2.105V4M3 4h2M3 4H1m4 0h8M5 4c0-.932 0-1.398.152-1.765a2 2 0 0 1 1.082-1.083C6.602 1 7.068 1 8 1h2c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C13 2.602 13 3.068 13 4m0 0h2m0 0h2"
    />
  </Svg>
);
