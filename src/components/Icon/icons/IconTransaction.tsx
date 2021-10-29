import React, { FC, ReactElement } from "react";

import { SvgIconProps } from "../Icon";

const IconTransaction: FC<SvgIconProps> = ({
  className = "",
}): ReactElement => (
  <svg width="12" height="21" viewBox="0 0 12 21">
    <path d="M4.57384 17.9222L10.7109 12.7726L9.24172 11.0216L3.10461 16.1713L0.900767 13.5448L0.346062 19.9779L6.77768 20.5487L4.57384 17.9222ZM11.697 1.50192L5.26538 0.931111L7.46923 3.55755L1.33212 8.7072L2.80134 10.4582L8.93845 5.30851L11.1423 7.93495L11.697 1.50192Z" />
  </svg>
);

export default IconTransaction;
