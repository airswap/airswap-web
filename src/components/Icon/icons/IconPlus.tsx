import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconPlus: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg fill="currentColor" viewBox="0 0 14 14" className={className}>
    <path d="M6.25 14V7.75H0V6.25H6.25V0H7.75V6.25H14V7.75H7.75V14H6.25Z" />
  </svg>
);

export default IconPlus;
