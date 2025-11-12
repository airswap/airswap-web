import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconDoubleArrow: FC<SvgIconProps> = ({
  className = "",
}): ReactElement => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M9.575 12L5 7.4L6.4 6L12.4 12L6.4 18L5 16.6L9.575 12ZM16.175 12L11.6 7.4L13 6L19 12L13 18L11.6 16.6L16.175 12Z" />
  </svg>
);

export default IconDoubleArrow;
