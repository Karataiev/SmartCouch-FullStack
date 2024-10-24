import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgCreateProgram = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 7h16M1 7v8.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h9.606c1.118 0 1.677 0 2.104-.218.377-.192.683-.498.875-.874.218-.428.218-.986.218-2.104V7M1 7v-.8c0-1.12 0-1.68.218-2.108.192-.377.497-.682.874-.874C2.52 3 3.08 3 4.2 3H5m12 4v-.803c0-1.118 0-1.678-.218-2.105a2.001 2.001 0 0 0-.875-.874C15.48 3 14.92 3 13.8 3H13M5 3h8M5 3V1m8 2V1m-1 10-4 4-2-2"
    />
  </Svg>
);
