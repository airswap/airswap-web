import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconCode: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z" />
  </svg>
);

export default IconCode;
