import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { toAtomicString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import nativeCurrency, {
  nativeCurrencyAddress,
  nativeCurrencySafeTransactionFee,
} from "../../constants/nativeCurrency";
import { selectBalances } from "../../features/balances/balancesSlice";
import {
  selectActiveTokens,
  selectAllTokenInfo,
} from "../../features/metadata/metadataSlice";
import { createOtcOrder } from "../../features/otc/otcActions";
import { selectOtcStatus } from "../../features/otc/otcSlice";
import { selectAllSupportedTokens } from "../../features/registry/registrySlice";
import {
  selectUserTokens,
  setUserTokens,
} from "../../features/userSettings/userSettingsSlice";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useMaxAmount from "../../hooks/useMaxAmount";
import useTokenAddress from "../../hooks/useTokenAddress";
import useTokenInfo from "../../hooks/useTokenInfo";
import { OrderScopeType, OrderType } from "../../types/orderTypes";
import { TokenSelectModalTypes } from "../../types/tokenSelectModalTypes";
import Checkbox from "../Checkbox/Checkbox";
import { SelectOption } from "../Dropdown/Dropdown";
import OrderTypesModal from "../InformationModals/subcomponents/OrderTypesModal/OrderTypesModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import TokenList from "../TokenList/TokenList";
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
  const dispatch = useAppDispatch();

  const balances = useAppSelector(selectBalances);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const supportedTokens = useAppSelector(selectAllSupportedTokens);
  const userTokens = useAppSelector(selectUserTokens);
  const otcStatus = useAppSelector(selectOtcStatus);

  const { active, chainId, account, library } = useWeb3React<Web3Provider>();

  const orderTypeSelectOptions = useMemo(
    () => getOrderTypeSelectOptions(t),
    [t]
  );

  const [expiry, setExpiry] = useState(new Date().getTime());
  const [orderType, setOrderType] = useState<OrderType>(OrderType.publicListed);
  const [orderScopeTypeOption, setOrderScopeTypeOption] =
    useState<SelectOption>(orderTypeSelectOptions[0]);
  const [takerAddress, setTakerAddress] = useState("");
  // const [takerAddress, setTakerAddress] = useState(
  //   "0x8234B4236bA45003f22E5e2b2aC9296576B085C2"
  // );
  const [makerAmount, setMakerAmount] = useState("");
  const [takerAmount, setTakerAmount] = useState("");
  const [showOrderTypeInfo, toggleShowOrderTypeInfo] = useToggle(false);

  const defaultTokenFromAddress = useTokenAddress("USDT");
  const defaultTokenToAddress = nativeCurrency[chainId!]?.address;
  const makerTokenInfo = useTokenInfo(
    userTokens.tokenFrom || defaultTokenFromAddress || null
  );
  const takerTokenInfo = useTokenInfo(
    userTokens.tokenTo || defaultTokenToAddress || null
  );
  const hasInsufficientMakerTokenBalance = useInsufficientBalance(
    makerTokenInfo,
    makerAmount
  );
  const hasMissingMakerAmount =
    !makerAmount.length || parseFloat(makerAmount) === 0 || makerAmount === ".";
  const hasMissingTakerAmount =
    !takerAmount.length || parseFloat(takerAmount) === 0 || takerAmount === ".";
  const maxAmount = useMaxAmount(makerAmount);
  const showMaxButton = !!maxAmount && makerAmount !== maxAmount;
  const showMaxInfoButton =
    !!maxAmount &&
    makerTokenInfo?.address === nativeCurrencyAddress &&
    !!nativeCurrencySafeTransactionFee[makerTokenInfo.chainId];

  const [showTokenSelectModalFor, setShowTokenSelectModalFor] =
    useState<TokenSelectModalTypes>(null);

  useEffect(() => {
    if (orderScopeTypeOption.value === OrderScopeType.private) {
      return setOrderType(OrderType.private);
    }

    return setOrderType(OrderType.publicListed);
  }, [orderScopeTypeOption]);

  const handleOrderTypeCheckboxChange = (isChecked: boolean) => {
    setOrderType(isChecked ? OrderType.publicListed : OrderType.publicUnlisted);
  };

  const handleSetToken = (type: TokenSelectModalTypes, value: string) => {
    const newUserTokens = {
      ...(type === "base" && { tokenFrom: value }),
      ...(type === "quote" && { tokenTo: value }),
    };
    dispatch(setUserTokens(newUserTokens));
  };

  const handleSignButtonClick = async () => {
    const expiryDate = Date.now() + expiry;
    const result = await dispatch(
      createOtcOrder({
        nonce: expiryDate.toString(),
        expiry: Math.floor(expiryDate / 1000).toString(),
        signerWallet:
          orderType === OrderType.private
            ? takerAddress
            : nativeCurrencyAddress,
        signerToken: makerTokenInfo?.address!,
        signerAmount: toAtomicString(makerAmount, makerTokenInfo?.decimals!),
        protocolFee: "7",
        senderWallet: account!,
        senderToken: takerTokenInfo?.address!,
        senderAmount: toAtomicString(takerAmount, takerTokenInfo?.decimals!),
        chainId: chainId!,
        library: library,
      })
    );

    if (result) {
      console.log(result);
    }
  };

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <Container>
      <MakeWidgetHeader title={t("common.make")} onExpiryChange={setExpiry} />
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
        onChangeTokenClick={setShowTokenSelectModalFor}
        onMaxButtonClick={() => setTakerAmount(maxAmount || "0")}
      />
      <OrderTypeSelectorAndRateFieldWrapper>
        <StyledOrderTypeSelector
          options={orderTypeSelectOptions}
          selectedOrderTypeOption={orderScopeTypeOption}
          onChange={setOrderScopeTypeOption}
        />
        {makerTokenInfo &&
          takerTokenInfo &&
          !hasMissingMakerAmount &&
          !hasMissingTakerAmount && (
            <StyledRateField
              token1={makerTokenInfo?.symbol || "??"}
              token2={takerTokenInfo?.symbol || "??"}
              rate={new BigNumber(takerAmount).dividedBy(
                new BigNumber(makerAmount)
              )}
            />
          )}
      </OrderTypeSelectorAndRateFieldWrapper>
      {orderType === OrderType.private ? (
        <StyledAddressInput
          value={takerAddress}
          onChange={setTakerAddress}
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
        hasInsufficientExpiry={expiry === 0}
        hasInsufficientMakerTokenBalance={hasInsufficientMakerTokenBalance}
        hasMissingMakerAmount={hasMissingMakerAmount}
        hasMissingMakerToken={!makerTokenInfo}
        hasMissingTakerAmount={hasMissingTakerAmount}
        hasMissingTakerToken={!takerTokenInfo}
        walletIsNotConnected={!active}
        makerTokenSymbol={makerTokenInfo?.symbol}
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={handleSignButtonClick}
      />
      <Overlay
        onCloseButtonClick={() => setShowTokenSelectModalFor(null)}
        isHidden={!showTokenSelectModalFor}
      >
        <TokenList
          onSelectToken={(newTokenAddress) => {
            handleSetToken(showTokenSelectModalFor, newTokenAddress);
            setShowTokenSelectModalFor(null);
          }}
          balances={balances}
          allTokens={allTokens}
          activeTokens={activeTokens}
          supportedTokenAddresses={supportedTokens}
        />
      </Overlay>
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
