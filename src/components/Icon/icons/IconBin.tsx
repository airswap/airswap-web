import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconBin: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg viewBox="0 0 10 12" className={className}>
    <path d="M1.00004 10.6667C1.00004 11.4 1.60004 12 2.33337 12H7.66671C8.40004 12 9.00004 11.4 9.00004 10.6667V2.66667H1.00004V10.6667ZM2.33337 4H7.66671V10.6667H2.33337V4ZM7.33337 0.666667L6.66671 0H3.33337L2.66671 0.666667H0.333374V2H9.66671V0.666667H7.33337Z" />
  </svg>
);

export default IconBin;
