import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconSwap: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg fill="currentColor" viewBox="0 0 10 13" className={className}>
    <path d="M7.85714 10.0071V5H6.42857V10.0071H4.28571L7.14286 12.8571L10 10.0071H7.85714ZM2.85714 0L0 2.85H2.14286V7.85714H3.57143V2.85H5.71429L2.85714 0Z" />
  </svg>
);

export default IconSwap;
