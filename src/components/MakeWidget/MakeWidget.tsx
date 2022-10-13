import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { wrappedTokenAddresses } from "@airswap/constants";
import { compressFullOrder, toAtomicString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { unwrapResult } from "@reduxjs/toolkit";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import nativeCurrency, {
  nativeCurrencyAddress,
  nativeCurrencySafeTransactionFee,
} from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { selectBalances } from "../../features/balances/balancesSlice";
import { createOtcOrder } from "../../features/makeOtc/makeOtcActions";
import {
  clearLastUserOrder,
  reset,
  selectMakeOtcReducer,
} from "../../features/makeOtc/makeOtcSlice";
import { getSavedActiveTokensInfo } from "../../features/metadata/metadataApi";
import {
  selectActiveTokens,
  selectAllTokenInfo,
} from "../../features/metadata/metadataSlice";
import { approve, deposit } from "../../features/orders/ordersSlice";
import {
  selectUserTokens,
  setUserTokens,
} from "../../features/userSettings/userSettingsSlice";
import switchToEthereumChain from "../../helpers/switchToEthereumChain";
import useApprovalPending from "../../hooks/useApprovalPending";
import useDepositPending from "../../hooks/useDepositPending";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useMaxAmount from "../../hooks/useMaxAmount";
import useShouldDepositNativeToken from "../../hooks/useShouldDepositNativeTokenAmount";
import useSufficientAllowance from "../../hooks/useSufficientAllowance";
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
  StyledActionButtons,
  StyledAddressInput,
  StyledInfoSection,
  StyledInputSection,
  StyledOrderTypeSelector,
  StyledRateField,
} from "./MakeWidget.styles";
import { getNewTokenPair } from "./helpers";
import useOrderTypeSelectOptions from "./hooks/useOrderTypeSelectOptions";
import { ButtonActions } from "./subcomponents/ActionButtons/ActionButtons";
import MakeWidgetHeader from "./subcomponents/MakeWidgetHeader/MakeWidgetHeader";

const MakeWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const balances = useAppSelector(selectBalances);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const userTokens = useAppSelector(selectUserTokens);
  const { status, error, lastUserOrder } = useAppSelector(selectMakeOtcReducer);
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
  const hasInsufficientAllowance = !useSufficientAllowance(
    makerTokenInfo,
    makerAmount
  );
  const hasInsufficientBalance = useInsufficientBalance(
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
  const hasApprovalPending = useApprovalPending(makerTokenInfo?.address);
  const shouldDepositNativeTokenAmount =
    useShouldDepositNativeToken(makerAmount);
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const hasDepositPending = useDepositPending();

  // Modal states
  const { setShowWalletList } = useContext(InterfaceContext);
  const [showOrderTypeInfo, toggleShowOrderTypeInfo] = useToggle(false);
  const [showTokenSelectModal, setShowTokenSelectModal] =
    useState<TokenSelectModalTypes>(null);

  // useEffects
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (orderScopeTypeOption.value === OrderScopeType.private) {
      return setOrderType(OrderType.private);
    }

    return setOrderType(OrderType.publicListed);
  }, [orderScopeTypeOption]);

  useMemo(() => {
    if (chainId && account) {
      getSavedActiveTokensInfo(account, chainId);
    }
  }, [chainId, account]);

  useEffect(() => {
    if (lastUserOrder) {
      const compressedOrder = compressFullOrder(lastUserOrder);
      history.push({ pathname: `/${AppRoutes.order}/${compressedOrder}` });
      dispatch(clearLastUserOrder());
    }
  }, [lastUserOrder, history, dispatch]);

  // Event handlers
  const handleOrderTypeCheckboxChange = (isChecked: boolean) => {
    setOrderType(isChecked ? OrderType.publicListed : OrderType.publicUnlisted);
  };

  const handleSetToken = (type: TokenSelectModalTypes, value: string) => {
    const { tokenFrom, tokenTo } = getNewTokenPair(
      type,
      value,
      userTokens.tokenFrom || defaultTokenFromAddress || undefined,
      userTokens.tokenTo || defaultTokenToAddress || undefined
    );

    dispatch(
      setUserTokens({
        tokenFrom,
        tokenTo,
      })
    );
  };

  const createOrder = () => {
    const expiryDate = Date.now() + expiry;
    const makerTokenAddress = makerTokenInfo?.address!;
    const takerTokenAddress = takerTokenInfo?.address!;

    const signerToken =
      makerTokenAddress === nativeCurrencyAddress
        ? wrappedTokenAddresses[chainId!]
        : makerTokenAddress;
    const senderToken =
      takerTokenAddress === nativeCurrencyAddress
        ? wrappedTokenAddresses[chainId!]
        : takerTokenAddress;

    dispatch(
      createOtcOrder({
        nonce: expiryDate.toString(),
        expiry: Math.floor(expiryDate / 1000).toString(),
        signerWallet: account!,
        signerToken,
        signerAmount: toAtomicString(makerAmount, makerTokenInfo?.decimals!),
        protocolFee: "7",
        senderWallet:
          orderType === OrderType.private
            ? takerAddress!
            : nativeCurrencyAddress,
        senderToken,
        senderAmount: toAtomicString(takerAmount, takerTokenInfo?.decimals!),
        chainId: chainId!,
        library: library!,
      })
    );
  };

  const approveToken = () => {
    const tokenAddress = makerTokenInfo?.address!;

    dispatch(
      approve({
        token:
          tokenAddress === nativeCurrencyAddress
            ? wrappedTokenAddresses[chainId!]
            : tokenAddress,
        library,
        contractType: "Swap",
        chainId: chainId!,
      })
    );
  };

  const depositNativeToken = async () => {
    const result = await dispatch(
      deposit({
        chainId: chainId!,
        senderAmount: makerAmount,
        senderTokenDecimals: makerTokenInfo!.decimals,
        provider: library!,
      })
    );
    await unwrapResult(result);
  };

  const handleActionButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.sign) {
      createOrder();
    }

    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToEthereumChain();
    }

    if (action === ButtonActions.approve) {
      approveToken();
    }

    if (action === ButtonActions.restart) {
      dispatch(reset());
    }

    if (action === ButtonActions.deposit) {
      depositNativeToken();
    }
  };

  const handleBackButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.restart) {
      dispatch(reset());
    }

    if (action === ButtonActions.goBack) {
      history.goBack();
    }
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
        <StyledInputSection onInfoButtonClick={toggleShowOrderTypeInfo}>
          <Checkbox
            checked={orderType === OrderType.publicListed}
            label={t("orders.publiclyList")}
            subLabel={t("orders.publiclyListDescription")}
            onChange={handleOrderTypeCheckboxChange}
          />
        </StyledInputSection>
      )}
      <StyledInfoSection
        shouldDepositNativeTokenAmount={shouldDepositNativeTokenAmount}
      />
      <StyledActionButtons
        hasInsufficientExpiry={expiry === 0}
        hasInsufficientAllowance={hasInsufficientAllowance}
        hasInsufficientBalance={hasInsufficientBalance}
        hasMissingMakerAmount={hasMissingMakerAmount}
        hasMissingMakerToken={!makerTokenInfo}
        hasMissingTakerAmount={hasMissingTakerAmount}
        hasMissingTakerToken={!takerTokenInfo}
        isLoading={hasApprovalPending || hasDepositPending}
        networkIsUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
        shouldDepositNativeToken={shouldDepositNativeToken}
        takerAddressIsInvalid={
          !takerAddressIsValid && orderType === OrderType.private
        }
        userIsSigning={status === "signing"}
        walletIsNotConnected={!active}
        makerTokenSymbol={makerTokenInfo?.symbol}
        takerTokenSymbol={takerTokenInfo?.symbol}
        onBackButtonClick={handleBackButtonClick}
        onActionButtonClick={handleActionButtonClick}
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
          supportedTokenAddresses={[]}
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
        isHidden={!error}
      >
        <ErrorList
          errors={error ? [error] : []}
          onBackButtonClick={() =>
            handleActionButtonClick(ButtonActions.restart)
          }
        />
      </Overlay>
    </Container>
  );
};

export default MakeWidget;
