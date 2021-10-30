import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconArrowDown: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg viewBox="0 0 12 12" className={className}>
    <path
      d="M11.3334 5.99996L10.3934 5.05996L6.66675 8.77996V0.666626H5.33341V8.77996L1.61341 5.05329L0.666748 5.99996L6.00008 11.3333L11.3334 5.99996Z"
      strokeWidth="0.4"
    />
  </svg>
);

export default IconArrowDown;
