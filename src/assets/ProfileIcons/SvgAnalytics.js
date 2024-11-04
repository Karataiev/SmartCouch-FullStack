import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgAnalytics = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={17}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 11v1.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218H19M1 11V1m0 10 3.853-3.21.004-.003c.697-.581 1.046-.872 1.425-.99a2 2 0 0 1 1.362.061c.367.153.688.474 1.332 1.118l.006.006c.654.654.981.981 1.354 1.133a2 2 0 0 0 1.385.046c.383-.128.733-.433 1.433-1.046L19 3"
    />
  </Svg>
);
