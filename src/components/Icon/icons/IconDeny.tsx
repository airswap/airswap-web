import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconDeny: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg fill="none" viewBox="0 0 20 20" className={className}>
    <path
      d="M5 9V11H15V9H5ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
      fill="#6E7686"
    />
  </svg>
);

export default IconDeny;
