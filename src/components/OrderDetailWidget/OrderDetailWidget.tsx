import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";

import { addDays } from "date-fns";

import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import FeeModal from "../InformationModals/subcomponents/FeeModal/FeeModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container, StyledInfoButtons } from "./OrderDetailWidget.styles";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import OrderDetailWidgetHeader from "./subcomponents/OrderDetailWidgetHeader/OrderDetailWidgetHeader";

// Dummy data, this data will come from store later.
const expiry = addDays(new Date(), 1);
const orderStatus = OrderStatus.open;
const orderType = OrderType.private;
const recipientAddress = nativeCurrencyAddress;
const transactionLink =
  "https://etherscan.io/tx/0x53ddb90435ab46d96035da71b4ff8a26bb0a682a7f2327aaeb8ff3848406204f";

const OrderDetailWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { account } = useWeb3React<Web3Provider>();

  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <Container>
      <OrderDetailWidgetHeader
        expiry={expiry}
        orderStatus={orderStatus}
        orderType={orderType}
        recipientAddress={recipientAddress}
        transactionLink={transactionLink}
        userAddress={account || undefined}
      />
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
      <StyledInfoButtons
        ownerIsCurrentUser
        onFeeButtonClick={toggleShowFeeInfo}
      />
      <ActionButtons
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={() => {}}
      />

      <Overlay
        title={t("common.fee")}
        onCloseButtonClick={() => toggleShowFeeInfo()}
        isHidden={!showFeeInfo}
      >
        <FeeModal onCloseButtonClick={() => toggleShowFeeInfo()} />
      </Overlay>
    </Container>
  );
};

export default OrderDetailWidget;
