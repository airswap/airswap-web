import React, { FC } from "react";

import htmlContent from "./whitepaperContent";
import HelmetContainer from "../../components/HelmetContainer/HelmetContainer";

const Whitepaper: FC = () => {
  return (
    <>
      <HelmetContainer
        title={"AirSwap Whitepaper"}
        description={"Learn how the Airswap protocol can save you money by powering gasless p2p crypto trades."}
      />

      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
};

export default Whitepaper;
