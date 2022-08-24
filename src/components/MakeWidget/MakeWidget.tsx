import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useToggle } from "@react-hookz/web";

import { BigNumber } from "bignumber.js";

import {
  nativeCurrencyAddress,
  nativeCurrencySafeTransactionFee,
} from "../../constants/nativeCurrency";
import useMaxAmount from "../../hooks/useMaxAmount";
import useTokenInfo from "../../hooks/useTokenInfo";
import { OrderScopeType, OrderType } from "../../types/orderTypes";
import Checkbox from "../Checkbox/Checkbox";
import { SelectOption } from "../Dropdown/Dropdown";
import OrderTypesModal from "../InformationModals/subcomponents/OrderTypesModal/OrderTypesModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import {
  Container,
  OrderTypeSelectorAndRateFieldWrapper,
  StyledAddressInput,
  StyledInfoSection,
  StyledOrderTypeSelector,
  StyledRateField,
} from "./MakeWidget.styles";
import { getOrderTypeSelectOptions } from "./helpers";
import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import MakeWidgetHeader from "./subcomponents/MakeWidgetHeader/MakeWidgetHeader";

const MakeWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const orderTypeSelectOptions = useMemo(
    () => getOrderTypeSelectOptions(t),
    [t]
  );

  const [orderType, setOrderType] = useState<OrderType>(OrderType.publicListed);
  const [orderScopeTypeOption, setOrderScopeTypeOption] =
    useState<SelectOption>(orderTypeSelectOptions[0]);
  const [makerAmount, setMakerAmount] = useState("");
  const [takerAmount, setTakerAmount] = useState("");
  const [address, setAddress] = useState("");
  const [showOrderTypeInfo, toggleShowOrderTypeInfo] = useToggle(false);

  const makerTokenInfo = useTokenInfo(makerAmount);
  const takerTokenInfo = useTokenInfo(takerAmount);
  const maxAmount = useMaxAmount(makerAmount);
  const showMaxButton = !!maxAmount && makerAmount !== maxAmount;
  const showMaxInfoButton =
    !!maxAmount &&
    makerTokenInfo?.address === nativeCurrencyAddress &&
    !!nativeCurrencySafeTransactionFee[makerTokenInfo.chainId];

  useEffect(() => {
    if (orderScopeTypeOption.value === OrderScopeType.private) {
      return setOrderType(OrderType.private);
    }

    return setOrderType(OrderType.publicListed);
  }, [orderScopeTypeOption]);

  const handleOrderTypeCheckboxChange = (isChecked: boolean) => {
    setOrderType(isChecked ? OrderType.publicListed : OrderType.publicUnlisted);
  };

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <Container>
      <MakeWidgetHeader title={t("common.make")} />
      <SwapInputs
        canSetQuoteAmount
        showMaxButton={showMaxButton}
        showMaxInfoButton={showMaxInfoButton}
        baseAmount={makerAmount}
        baseTokenInfo={makerTokenInfo}
        maxAmount={maxAmount}
        side="sell"
        quoteAmount={takerAmount}
        quoteTokenInfo={takerTokenInfo}
        onBaseAmountChange={setMakerAmount}
        onQuoteAmountChange={setTakerAmount}
        onChangeTokenClick={() => {}}
        onMaxButtonClick={() => setTakerAmount(maxAmount || "0")}
      />
      <OrderTypeSelectorAndRateFieldWrapper>
        <StyledOrderTypeSelector
          options={orderTypeSelectOptions}
          selectedOrderTypeOption={orderScopeTypeOption}
          onChange={setOrderScopeTypeOption}
        />
        <StyledRateField
          token1="AST"
          token2="USDT"
          rate={new BigNumber("0.01455")}
        />
      </OrderTypeSelectorAndRateFieldWrapper>
      {orderType === OrderType.private ? (
        <StyledAddressInput
          value={address}
          onChange={setAddress}
          onInfoButtonClick={toggleShowOrderTypeInfo}
        />
      ) : (
        <StyledInfoSection onInfoButtonClick={toggleShowOrderTypeInfo}>
          <Checkbox
            checked={orderType === OrderType.publicListed}
            label={t("orders.publiclyList")}
            subLabel={t("orders.publiclyListDescription")}
            onChange={handleOrderTypeCheckboxChange}
          />
        </StyledInfoSection>
      )}
      <ActionButtons
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={() => {}}
      />
      <Overlay
        title={t("information.orderTypes.title")}
        onCloseButtonClick={() => toggleShowOrderTypeInfo()}
        isHidden={!showOrderTypeInfo}
      >
        <OrderTypesModal onCloseButtonClick={() => toggleShowOrderTypeInfo()} />
      </Overlay>
    </Container>
  );
};

export default MakeWidget;
