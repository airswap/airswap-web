import React, { FC } from "react";
import { useHistory } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { addDays } from "date-fns";

import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import { OrderStatus } from "../../types/orderStatus";
import { OrderType } from "../../types/orderTypes";
import SwapInputs from "../SwapInputs/SwapInputs";
import { Container } from "./OrderDetailWidget.styles";
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
  const history = useHistory();
  const { account } = useWeb3React<Web3Provider>();

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
      <ActionButtons
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={() => {}}
      />
    </Container>
  );
};

export default OrderDetailWidget;
