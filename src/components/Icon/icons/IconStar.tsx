import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconStar: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg fill="currentColor" viewBox="0 0 14 13" className={className}>
    <path d="M6.99967 10.5133L11.1197 12.9999L10.0263 8.31325L13.6663 5.15992L8.87301 4.75325L6.99967 0.333252L5.12634 4.75325L0.333008 5.15992L3.97301 8.31325L2.87967 12.9999L6.99967 10.5133Z" />
  </svg>
);

export default IconStar;
