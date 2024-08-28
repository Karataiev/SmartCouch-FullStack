import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
export const SvgInProgressStatus = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={9}
    fill="none"
    {...props}>
    <Path
      fill="#F79605"
      fillRule="evenodd"
      d="M2.875.75a1 1 0 0 0-1 1V2H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h.875v.25a1 1 0 0 0 1 1h1.75a1 1 0 0 0 1-1V5.125h3.75V7.25a1 1 0 0 0 1 1h1.75a1 1 0 0 0 1-1V7H14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-.875v-.25a1 1 0 0 0-1-1h-1.75a1 1 0 0 0-1 1v2.125h-3.75V1.75a1 1 0 0 0-1-1h-1.75Zm10.25 2.5v2.5h.625v-2.5h-.625ZM11.875 2h-1.25v5h1.25V2Zm-7.5 0h-1.25v5h1.25V2Zm-2.5 3.75v-2.5H1.25v2.5h.625Z"
      clipRule="evenodd"
    />
  </Svg>
);
