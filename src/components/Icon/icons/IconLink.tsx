import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconLink: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
  </svg>
);

export default IconLink;
