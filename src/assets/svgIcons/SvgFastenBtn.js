import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgFastenBtn = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={15}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.5 13.833c0-1.84-2.239-3.333-5-3.333s-5 1.492-5 3.333m13.333-2.5v-2.5m0 0v-2.5m0 2.5h-2.5m2.5 0h2.5M6.5 8a3.333 3.333 0 1 1 0-6.667A3.333 3.333 0 0 1 6.5 8Z"
    />
  </Svg>
);
