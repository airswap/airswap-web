import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import SwapInputs from "../SwapInputs/SwapInputs";
import { Container } from "./OrderDetailWidget.styles";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidget";

const OrderDetailWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <Container>
      <OrderDetailWidgetHeader title={t("common.swap")} />
      <SwapInputs
        readOnly
        baseAmount="0.00"
        baseTokenInfo={null}
        maxAmount={null}
        side="sell"
        quoteAmount="0.00"
        quoteTokenInfo={null}
        onBaseAmountChange={() => {}}
        onChangeTokenClick={() => {}}
        onMaxButtonClick={() => {}}
      />
      <ActionButtons
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={() => {}}
      />
    </Container>
  );
};

export default OrderDetailWidget;
