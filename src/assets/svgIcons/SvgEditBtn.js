import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgEditBtn = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}>
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.333 16.667h13.333m-13.333 0v-3.334L10 6.667m-6.667 10h3.333L13.333 10M10 6.667l2.39-2.39.002-.002c.329-.33.494-.494.684-.556a.834.834 0 0 1 .515 0c.19.062.354.226.683.555l1.45 1.45c.33.33.495.495.556.685a.833.833 0 0 1 0 .515c-.061.19-.226.355-.556.685h0L13.332 10M10 6.668 13.333 10"
    />
  </Svg>
);
