import React, { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { compressFullOrder, toAtomicString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import nativeCurrency, {
  nativeCurrencyAddress,
  nativeCurrencySafeTransactionFee,
} from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { selectBalances } from "../../features/balances/balancesSlice";
import {
  selectActiveTokens,
  selectAllTokenInfo,
} from "../../features/metadata/metadataSlice";
import { createOtcOrder } from "../../features/otc/otcActions";
import {
  clearLastUserOrder,
  reset,
  selectOtcReducer,
} from "../../features/otc/otcSlice";
import { selectAllSupportedTokens } from "../../features/registry/registrySlice";
import {
  selectUserTokens,
  setUserTokens,
} from "../../features/userSettings/userSettingsSlice";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useMaxAmount from "../../hooks/useMaxAmount";
import useTokenAddress from "../../hooks/useTokenAddress";
import useTokenInfo from "../../hooks/useTokenInfo";
import useValidAddress from "../../hooks/useValidAddress";
import { AppRoutes } from "../../routes";
import { OrderScopeType, OrderType } from "../../types/orderTypes";
import { TokenSelectModalTypes } from "../../types/tokenSelectModalTypes";
import Checkbox from "../Checkbox/Checkbox";
import { SelectOption } from "../Dropdown/Dropdown";
import { ErrorList } from "../ErrorList/ErrorList";
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
import useOrderTypeSelectOptions from "./hooks/useOrderTypeSelectOptions";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
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
  const { status, errors, lastUserOrder } = useAppSelector(selectOtcReducer);
  const {
    active,
    chainId,
    account,
    library,
    error: web3Error,
  } = useWeb3React<Web3Provider>();

  // Input options
  const orderTypeSelectOptions = useOrderTypeSelectOptions();

  // User input states
  const [expiry, setExpiry] = useState(new Date().getTime());
  const [orderType, setOrderType] = useState<OrderType>(OrderType.publicListed);
  const [orderScopeTypeOption, setOrderScopeTypeOption] =
    useState<SelectOption>(orderTypeSelectOptions[0]);
  const [takerAddress, setTakerAddress] = useState("");
  const [makerAmount, setMakerAmount] = useState("");
  const [takerAmount, setTakerAmount] = useState("");

  // States derived from user input
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
  const takerAddressIsValid = useValidAddress(takerAddress);

  // Modal states
  const { setShowWalletList } = useContext(InterfaceContext);
  const [showOrderTypeInfo, toggleShowOrderTypeInfo] = useToggle(false);
  const [showTokenSelectModal, setShowTokenSelectModal] =
    useState<TokenSelectModalTypes>(null);

  // useEffects
  useEffect(() => {
    if (orderScopeTypeOption.value === OrderScopeType.private) {
      return setOrderType(OrderType.private);
    }

    return setOrderType(OrderType.publicListed);
  }, [orderScopeTypeOption]);

  useEffect(() => {
    if (lastUserOrder) {
      const compressedOrder = compressFullOrder(lastUserOrder);
      history.push({ pathname: `/${AppRoutes.order}/${compressedOrder}` });
      dispatch(clearLastUserOrder());
    }
  }, [lastUserOrder, history]);

  // Event handler's
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

  const handleActionButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.sign) {
      const expiryDate = Date.now() + expiry;
      dispatch(
        createOtcOrder({
          nonce: expiryDate.toString(),
          expiry: Math.floor(expiryDate / 1000).toString(),
          signerWallet:
            orderType === OrderType.private
              ? takerAddress
              : nativeCurrencyAddress,
          signerToken: makerTokenInfo?.address!,
          signerAmount: toAtomicString(makerAmount, takerTokenInfo?.decimals!),
          protocolFee: "7",
          senderWallet: account!,
          senderToken: takerTokenInfo?.address!,
          senderAmount: toAtomicString(takerAmount, takerTokenInfo?.decimals!),
          chainId: chainId!,
          library: library,
        })
      );
    }

    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToEthereumChain();
    }

    if (action === ButtonActions.restart) {
      dispatch(reset());
    }
  };

  const handleBackButtonClick = () => {
    history.goBack();
  };

  return (
    <Container>
      <MakeWidgetHeader
        hideExpirySelector={!!showTokenSelectModal}
        title={t("common.make")}
        onExpiryChange={setExpiry}
      />
      <SwapInputs
        canSetQuoteAmount
        disabled={!active}
        readOnly={status !== "idle" || !active}
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
        onChangeTokenClick={setShowTokenSelectModal}
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
        networkIsUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
        takerAddressIsInvalid={
          !takerAddressIsValid && orderType === OrderType.private
        }
        userIsSigning={status === "signing"}
        walletIsNotConnected={!active}
        makerTokenSymbol={makerTokenInfo?.symbol}
        takerTokenSymbol={takerTokenInfo?.symbol}
        onBackButtonClick={handleBackButtonClick}
        onSignButtonClick={handleActionButtonClick}
      />
      <Overlay
        onCloseButtonClick={() => setShowTokenSelectModal(null)}
        isHidden={!showTokenSelectModal}
      >
        <TokenList
          onSelectToken={(newTokenAddress) => {
            handleSetToken(showTokenSelectModal, newTokenAddress);
            setShowTokenSelectModal(null);
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
      <Overlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onCloseButtonClick={() =>
          handleActionButtonClick(ButtonActions.restart)
        }
        isHidden={!errors.length}
      >
        <ErrorList
          errors={errors}
          handleClick={() => handleActionButtonClick(ButtonActions.restart)}
        />
      </Overlay>
    </Container>
  );
};

export default MakeWidget;
