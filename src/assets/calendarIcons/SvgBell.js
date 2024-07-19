import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgBell = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={19}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.5 14.167V15a2.5 2.5 0 1 1-5 0v-.833m5 0h-5m5 0h3.333c.46 0 .834-.373.834-.834v-.488a.833.833 0 0 0-.245-.59l-.425-.425a.559.559 0 0 1-.164-.395V8.333c0-.147-.005-.293-.016-.436M5.5 14.167H2.167a.834.834 0 0 1-.834-.834v-.488c0-.221.088-.433.244-.589l.426-.426a.557.557 0 0 0 .164-.395V8.333a5.833 5.833 0 0 1 7.537-5.58m4.113 5.144a3.333 3.333 0 1 0-4.113-5.144m4.113 5.144a3.333 3.333 0 0 1-4.113-5.144m4.113 5.144s0 0 0 0ZM9.704 2.753h.002"
    />
  </Svg>
);
