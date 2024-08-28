import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgWaitingStatus = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={14}
    fill="none"
    {...props}>
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M4.625 1.25c0-.345.28-.625.625-.625h2.5a.625.625 0 1 1 0 1.25h-2.5a.625.625 0 0 1-.625-.625Zm5.808.808a.625.625 0 0 1 .884 0l1.25 1.25a.625.625 0 1 1-.884.884l-1.25-1.25a.625.625 0 0 1 0-.884ZM6.5 3.75a4.375 4.375 0 1 0 0 8.75 4.375 4.375 0 0 0 0-8.75ZM.875 8.125a5.625 5.625 0 1 1 11.25 0 5.625 5.625 0 0 1-11.25 0ZM6.5 5c.345 0 .625.28.625.625v2.5a.625.625 0 1 1-1.25 0v-2.5c0-.345.28-.625.625-.625Z"
      clipRule="evenodd"
    />
  </Svg>
);
