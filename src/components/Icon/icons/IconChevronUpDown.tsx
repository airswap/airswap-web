import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconChevronUpDown: FC<SvgIconProps> = ({
  className = "",
}): ReactElement => (
  <svg viewBox="0 0 16 23" className={className}>
    <g clipPath="url(#clip0_11007_17296)">
      <path d="M4.94 12.2969L8 15.0726L11.06 12.2969L12 13.1514L8 16.7878L4 13.1514L4.94 12.2969Z" />
    </g>
    <g clipPath="url(#clip1_11007_17296)">
      <path d="M11.06 10.2485L8 7.47278L4.94 10.2485L4 9.39399L8 5.75763L12 9.39399L11.06 10.2485Z" />
    </g>
    <defs>
      <clipPath id="clip0_11007_17296">
        <path d="M0 15.2727C0 11.2561 3.25611 8 7.27272 8H16V22.5455H7.27272C3.25611 22.5455 0 19.2893 0 15.2727Z" />
      </clipPath>
      <clipPath id="clip1_11007_17296">
        <path d="M16 7.27268C16 11.2893 12.7439 14.5454 8.72728 14.5454H0V-4.48227e-05H8.72728C12.7439 -4.48227e-05 16 3.25607 16 7.27268Z" />
      </clipPath>
    </defs>
  </svg>
);

export default IconChevronUpDown;
