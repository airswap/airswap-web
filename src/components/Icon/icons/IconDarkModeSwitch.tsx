import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconDarkModeSwitch: FC<SvgIconProps> = ({
  className = "",
}): ReactElement => (
  <svg fill="none" viewBox="0 0 26 26" className={className}>
    <path
      className="stroke"
      d="M12.9946 18.4559C16.0076 18.4559 18.4501 16.0134 18.4501 13.0005C18.4501 9.98761 16.0076 7.54517 12.9946 7.54517C9.98158 7.54517 7.53906 9.98761 7.53906 13.0005C7.53906 16.0134 9.98158 18.4559 12.9946 18.4559Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="stroke"
      d="M13 1V3.18214"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="stroke"
      d="M13 22.822V25.0042"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="stroke"
      d="M4.51562 4.51343L6.06506 6.06274"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="stroke"
      d="M19.9375 19.9404L21.4869 21.4897"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="stroke"
      d="M1 13.0024H3.18222"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="stroke"
      d="M22.8203 13.0024H25.0025"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="stroke"
      d="M4.51562 21.4897L6.06506 19.9404"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      className="stroke"
      d="M19.9375 6.06274L21.4869 4.51343"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13 19.003V7.60107L17.0507 9.02632L18.4009 13.302L16.3756 17.5778L13 19.003Z" />
  </svg>
);

export default IconDarkModeSwitch;
