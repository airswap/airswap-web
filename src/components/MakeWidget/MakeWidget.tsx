import React, { FC } from "react";
import { useHistory } from "react-router-dom";

import SwapInputs from "../SwapInputs/SwapInputs";
import { Container } from "./MakeWidget.styles";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import MakeWidgetHeader from "./subcomponents/MakeWidgetHeader/MakeWidgetHeader";

const MakeWidget: FC = () => {
  const history = useHistory();

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <Container>
      <MakeWidgetHeader title="Make" />
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
      <ActionButtons
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={() => {}}
      />
    </Container>
  );
};

export default MakeWidget;
