import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconBars: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M5 9.2H8V19H5V9.2ZM10.6 5H13.4V19H10.6V5ZM16.2 13H19V19H16.2V13Z" />
  </svg>
);

export default IconBars;
