import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconEdit: FC<SvgIconProps> = ({ className = "" }): ReactElement => (
  <svg viewBox="0 0 25 24" className={className}>
    <path d="M14.5131 9.02L15.4331 9.94L6.37312 19H5.45312V18.08L14.5131 9.02ZM18.1131 3C17.8631 3 17.6031 3.1 17.4131 3.29L15.5831 5.12L19.3331 8.87L21.1631 7.04C21.5531 6.65 21.5531 6.02 21.1631 5.63L18.8231 3.29C18.6231 3.09 18.3731 3 18.1131 3ZM14.5131 6.19L3.45312 17.25V21H7.20312L18.2631 9.94L14.5131 6.19Z" />
  </svg>
);

export default IconEdit;
