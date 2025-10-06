import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { InfoSubHeading } from "../../../../Typography/Typography";

type InfoSectionProps = {
  userHasNoOrders: boolean;
  walletIsNotConnected: boolean;
};

const InfoSection: FC<InfoSectionProps> = ({
  userHasNoOrders,
  walletIsNotConnected,
}) => {
  const { t } = useTranslation();

  if (walletIsNotConnected) {
    return (
      <>
        <InfoSubHeading>{t("orders.connectWallet")}</InfoSubHeading>
      </>
    );
  }

  if (userHasNoOrders) {
    return (
      <>
        <InfoSubHeading>
          {t("orders.youHaveNoOpenOTCOrders")}
          {` `}
          {t("orders.startByCreatingANewOrder")}
        </InfoSubHeading>
      </>
    );
  }

  return null;
};

export default InfoSection;
