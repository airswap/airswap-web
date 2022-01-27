import React, { FC } from "react";
import "./Whitepaper.css";
import htmlContent from "./WhitepaperContent";

const Whitepaper: FC = () => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    </>
  );
};

export default Whitepaper;
