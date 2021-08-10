import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconArrowRight: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg fill="none" viewBox="0 0 12 20" className={className}>
    <path
      className="stroke"
      d="M2 18L10 10L2 2"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

export default IconArrowRight;
