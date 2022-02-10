import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconCheck: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg fill="none" viewBox="0 0 24 24" className={className}>
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
  </svg>
);

export default IconCheck;
