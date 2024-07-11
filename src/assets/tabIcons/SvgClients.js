import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const SvgClients = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M7 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM2 5a5 5 0 1 1 10 0A5 5 0 0 1 2 5Zm10-4a1 1 0 0 1 1-1 5 5 0 0 1 0 10 1 1 0 1 1 0-2 3 3 0 1 0 0-6 1 1 0 0 1-1-1ZM2.203 12.34C3.474 11.491 5.173 11 7 11c1.827 0 3.526.492 4.797 1.34C13.062 13.182 14 14.456 14 16a1 1 0 1 1-2 0c0-.666-.405-1.392-1.312-1.996C9.788 13.404 8.487 13 7 13s-2.788.404-3.688 1.004C2.405 14.608 2 15.334 2 16a1 1 0 1 1-2 0c0-1.543.938-2.817 2.203-3.66Zm11.824-.342a1 1 0 0 1 1.202-.744C17.733 11.844 20 13.56 20 16a1 1 0 1 1-2 0c0-1.043-1.072-2.29-3.23-2.8a1 1 0 0 1-.743-1.202Z"
      clipRule="evenodd"
    />
  </Svg>
);
