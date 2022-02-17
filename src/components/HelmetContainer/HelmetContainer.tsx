import React, { FC } from "react";
import { Helmet } from "react-helmet";

type HelmetContainerProps = {
  title: string;
  description?: string;
};

const HelmetContainer: FC<HelmetContainerProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {children}
    </Helmet>
  );
};

export default HelmetContainer;
