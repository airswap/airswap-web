import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import Checkbox from "../Checkbox/Checkbox";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container } from "./MakeWidget.styles";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import MakeWidgetHeader from "./subcomponents/MakeWidgetHeader/MakeWidgetHeader";

const MakeWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <Container>
      <MakeWidgetHeader title={t("common.make")} />
      <SwapInputs
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
      <Checkbox
        label="Publicy list"
        subLabel="Allow others to publicly find my swap"
        onChange={console.log}
      />
      <ActionButtons
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={() => {}}
      />
    </Container>
  );
};

export default MakeWidget;
