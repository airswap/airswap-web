import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { compressFullOrderERC20 } from "@airswap/utils";
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
import { AppErrorType } from "../../errors/appError";
import { selectBalances } from "../../features/balances/balancesSlice";
import {
  fetchIndexerUrls,
  selectIndexerReducer,
} from "../../features/indexer/indexerSlice";
import { createOtcOrder } from "../../features/makeOtc/makeOtcActions";
import {
  clearLastUserOrder,
  reset,
  selectMakeOtcReducer,
  setError,
} from "../../features/makeOtc/makeOtcSlice";
import {
  selectActiveTokens,
  selectAllTokenInfo,
  selectProtocolFee,
} from "../../features/metadata/metadataSlice";
import {
  approve,
  deposit,
  selectOrdersStatus,
} from "../../features/orders/ordersSlice";
import {
  selectUserTokens,
  setUserTokens,
} from "../../features/userSettings/userSettingsSlice";
import getWethAddress from "../../helpers/getWethAddress";
import switchToDefaultChain from "../../helpers/switchToDefaultChain";
import toMaxAllowedDecimalsNumberString from "../../helpers/toMaxAllowedDecimalsNumberString";
import useApprovalPending from "../../hooks/useApprovalPending";
import useDepositPending from "../../hooks/useDepositPending";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useMaxAmount from "../../hooks/useMaxAmount";
import useNativeWrappedToken from "../../hooks/useNativeWrappedToken";
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
import OrderTypesModal from "../InformationModals/subcomponents/OrderTypesModal/OrderTypesModal";
import ProtocolFeeModal from "../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import TokenList from "../TokenList/TokenList";
import WalletSignScreen from "../WalletSignScreen/WalletSignScreen";
import {
  Container,
  OrderTypeSelectorAndRateFieldWrapper,
  StyledActionButtons,
  StyledAddressInput,
  StyledInputSection,
  StyledOrderTypeSelector,
  StyledRateField,
  StyledTooltip,
  TooltipContainer,
} from "./MakeWidget.styles";
import { getNewTokenPair } from "./helpers";
import useOrderTypeSelectOptions from "./hooks/useOrderTypeSelectOptions";
import { ButtonActions } from "./subcomponents/ActionButtons/ActionButtons";
import MakeWidgetHeader from "./subcomponents/MakeWidgetHeader/MakeWidgetHeader";
import OrderReview from "./subcomponents/OrderReview/OrderReview";

export enum MakeWidgetState {
  list = "list",
  review = "review",
}

const MakeWidget: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const balances = useAppSelector(selectBalances);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const userTokens = useAppSelector(selectUserTokens);
  const protocolFee = useAppSelector(selectProtocolFee);
  const { indexerUrls } = useAppSelector(selectIndexerReducer);
  const {
    status: makeOtcStatus,
    error,
    lastUserOrder,
  } = useAppSelector(selectMakeOtcReducer);
  const ordersStatus = useAppSelector(selectOrdersStatus);
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
  const [state, setState] = useState<MakeWidgetState>(MakeWidgetState.list);
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
  const makerAmountPlusFee = useMemo(() => {
    return new BigNumber(makerAmount)
      .multipliedBy(1 + protocolFee / 10000)
      .toString();
  }, [makerAmount, protocolFee]);

  const hasInsufficientAllowance = !useSufficientAllowance(
    makerTokenInfo,
    makerAmountPlusFee
  );
  const hasInsufficientBalance = useInsufficientBalance(
    makerTokenInfo,
    makerAmount
  );
  const hasMissingMakerAmount =
    !makerAmount.length || parseFloat(makerAmount) === 0 || makerAmount === ".";
  const hasMissingTakerAmount =
    !takerAmount.length || parseFloat(takerAmount) === 0 || takerAmount === ".";
  const maxAmount = useMaxAmount(makerTokenInfo?.address || null, true);
  const showMaxButton = !!maxAmount && makerAmount !== maxAmount;
  const showMaxInfoButton =
    !!maxAmount &&
    makerTokenInfo?.address === nativeCurrencyAddress &&
    !!nativeCurrencySafeTransactionFee[makerTokenInfo.chainId];
  const hasApprovalPending = useApprovalPending(makerTokenInfo?.address);
  const wrappedNativeToken = useNativeWrappedToken(chainId);
  const shouldDepositNativeTokenAmount = useShouldDepositNativeToken(
    makerTokenInfo?.address,
    makerAmount
  );
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const hasDepositPending = useDepositPending();
  const isValidAddress = useValidAddress(takerAddress);

  // Modal states
  const { setShowWalletList } = useContext(InterfaceContext);
  const [showOrderTypeInfo, toggleShowOrderTypeInfo] = useToggle(false);
  const [showFeeInfo, toggleShowFeeInfo] = useToggle(false);
  const [showTokenSelectModal, setShowTokenSelectModal] =
    useState<TokenSelectModalTypes>(null);

  // useEffects
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (library) {
      dispatch(fetchIndexerUrls({ provider: library }));
    }
  }, [library]);

  useEffect(() => {
    if (orderScopeTypeOption.value === OrderScopeType.private) {
      return setOrderType(OrderType.private);
    }

    return setOrderType(OrderType.publicListed);
  }, [orderScopeTypeOption]);

  useEffect(() => {
    if (lastUserOrder) {
      const compressedOrder = compressFullOrderERC20(lastUserOrder);
      dispatch(clearLastUserOrder());
      history.push({ pathname: `/${AppRoutes.order}/${compressedOrder}` });
    }
  }, [lastUserOrder, history, dispatch]);

  useEffect(() => {
    if (!active) {
      setShowTokenSelectModal(null);
    }
  }, [active]);

  // Event handlers
  const handleOrderTypeCheckboxChange = (isChecked: boolean) => {
    setOrderType(isChecked ? OrderType.publicListed : OrderType.publicUnlisted);
  };

  const handleSetToken = (type: TokenSelectModalTypes, value: string) => {
    const { tokenFrom, tokenTo } = getNewTokenPair(
      type,
      value,
      userTokens.tokenTo || defaultTokenToAddress || undefined,
      userTokens.tokenFrom || defaultTokenFromAddress || undefined
    );

    dispatch(
      setUserTokens({
        tokenFrom,
        tokenTo,
      })
    );
  };

  const handleMakerAmountChange = (amount: string) => {
    setMakerAmount(
      toMaxAllowedDecimalsNumberString(amount, makerTokenInfo?.decimals)
    );
  };

  const handleTakerAmountChange = (amount: string) => {
    setTakerAmount(
      toMaxAllowedDecimalsNumberString(amount, takerTokenInfo?.decimals)
    );
  };

  const handleSwitchTokensButtonClick = () => {
    handleSetToken("base", userTokens.tokenTo || defaultTokenToAddress);
    setMakerAmount(takerAmount);
    setTakerAmount(makerAmount);
  };

  const reviewOrder = () => {
    if (orderType === OrderType.private && !isValidAddress) {
      dispatch(setError({ type: AppErrorType.invalidAddress }));

      return;
    }

    setState(MakeWidgetState.review);
  };

  const createOrder = () => {
    const expiryDate = Date.now() + expiry;
    const makerTokenAddress = makerTokenInfo?.address!;
    const takerTokenAddress = takerTokenInfo?.address!;

    const signerToken =
      makerTokenAddress === nativeCurrencyAddress
        ? getWethAddress(chainId!)
        : makerTokenAddress;
    const senderToken =
      takerTokenAddress === nativeCurrencyAddress
        ? getWethAddress(chainId!)
        : takerTokenAddress;

    setMakerAmount(makerAmount);
    setTakerAmount(takerAmount);

    dispatch(
      createOtcOrder({
        nonce: expiryDate.toString(),
        expiry: Math.floor(expiryDate / 1000).toString(),
        signerWallet: account!,
        signerToken,
        signerTokenInfo: makerTokenInfo!,
        signerAmount: makerAmount,
        protocolFee: protocolFee.toString(),
        senderWallet:
          orderType === OrderType.private
            ? takerAddress!
            : nativeCurrencyAddress,
        senderToken,
        senderTokenInfo: takerTokenInfo!,
        senderAmount: takerAmount,
        chainId: chainId!,
        library: library!,
        activeIndexers: indexerUrls,
        shouldSendToIndexers: orderType === OrderType.publicListed,
      })
    );
  };

  const approveToken = () => {
    const justifiedToken =
      makerTokenInfo?.address === nativeCurrencyAddress
        ? wrappedNativeToken
        : makerTokenInfo;

    dispatch(
      approve({
        token: justifiedToken!,
        library,
        contractType: "Swap",
        chainId: chainId!,
        amount: makerAmountPlusFee,
      })
    );
  };

  const depositNativeToken = async () => {
    const result = await dispatch(
      deposit({
        chainId: chainId!,
        senderAmount: shouldDepositNativeTokenAmount!,
        senderTokenDecimals: makerTokenInfo!.decimals,
        provider: library!,
      })
    );
    await unwrapResult(result);
  };

  const handleActionButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.connectWallet) {
      setShowWalletList(true);
    }

    if (action === ButtonActions.switchNetwork) {
      switchToDefaultChain();
    }

    if (action === ButtonActions.review) {
      reviewOrder();
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

    if (action === ButtonActions.sign) {
      createOrder();
    }
  };

  const handleBackButtonClick = (action: ButtonActions) => {
    if (action === ButtonActions.list) {
      setState(MakeWidgetState.list);
    }

    if (action === ButtonActions.restart) {
      dispatch(reset());
    }

    if (action === ButtonActions.goBack) {
      history.goBack();
    }
  };

  const handleAddressInputChange = (value: string) => {
    setTakerAddress(value);
    if (error?.type === AppErrorType.invalidAddress) {
      dispatch(setError(undefined));
    }
  };

  if (makeOtcStatus === "signing" || ordersStatus === "signing") {
    return (
      <Container>
        <WalletSignScreen />
      </Container>
    );
  }

  return (
    <Container>
      <MakeWidgetHeader
        hideExpirySelector={
          !!showTokenSelectModal || state === MakeWidgetState.review
        }
        state={state}
        onExpiryChange={setExpiry}
      />
      {state === MakeWidgetState.list && (
        <>
          <SwapInputs
            canSetQuoteAmount
            disabled={!active}
            readOnly={!active}
            showMaxButton={showMaxButton}
            showMaxInfoButton={showMaxInfoButton}
            baseAmount={makerAmount}
            baseTokenInfo={makerTokenInfo}
            maxAmount={maxAmount}
            side="sell"
            quoteAmount={takerAmount}
            quoteTokenInfo={takerTokenInfo}
            onBaseAmountChange={handleMakerAmountChange}
            onChangeTokenClick={setShowTokenSelectModal}
            onMaxButtonClick={() => handleMakerAmountChange(maxAmount || "0")}
            onQuoteAmountChange={handleTakerAmountChange}
            onSwitchTokensButtonClick={handleSwitchTokensButtonClick}
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
                  token1={makerTokenInfo.symbol}
                  token2={takerTokenInfo.symbol}
                  rate={new BigNumber(takerAmount).dividedBy(
                    new BigNumber(makerAmount)
                  )}
                />
              )}
          </OrderTypeSelectorAndRateFieldWrapper>
          {orderType === OrderType.private ? (
            <TooltipContainer>
              <StyledAddressInput
                hasError={!!error}
                value={takerAddress}
                onChange={handleAddressInputChange}
                onInfoButtonClick={toggleShowOrderTypeInfo}
              />

              {error && (
                <StyledTooltip>
                  {t("validatorErrors.invalidAddress", {
                    address: takerAddress,
                  })}
                </StyledTooltip>
              )}
            </TooltipContainer>
          ) : (
            <div />
          )}
        </>
      )}

      {state === MakeWidgetState.review && (
        <OrderReview
          chainId={chainId}
          expiry={expiry}
          signerAmountPlusFee={makerAmountPlusFee}
          orderType={orderType}
          protocolFee={protocolFee / 100}
          senderAddress={takerAddress}
          senderAmount={takerAmount}
          senderToken={takerTokenInfo}
          signerAmount={makerAmount}
          signerToken={makerTokenInfo}
          wrappedNativeToken={wrappedNativeToken}
          onFeeButtonClick={toggleShowFeeInfo}
        />
      )}
      <StyledActionButtons
        hasInsufficientExpiry={expiry === 0}
        hasInsufficientAllowance={hasInsufficientAllowance}
        hasInsufficientBalance={
          hasInsufficientBalance && !shouldDepositNativeToken
        }
        hasMissingMakerAmount={hasMissingMakerAmount}
        hasMissingMakerToken={!makerTokenInfo}
        hasMissingTakerAmount={hasMissingTakerAmount}
        hasMissingTakerToken={!takerTokenInfo}
        isLoading={hasApprovalPending || hasDepositPending}
        isNetworkUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
        shouldDepositNativeToken={shouldDepositNativeToken}
        walletIsNotConnected={!active}
        makerTokenSymbol={makerTokenInfo?.symbol}
        widgetState={state}
        onBackButtonClick={handleBackButtonClick}
        onActionButtonClick={handleActionButtonClick}
      />
      <Overlay
        onCloseButtonClick={() => setShowTokenSelectModal(null)}
        isHidden={!showTokenSelectModal}
      >
        <TokenList
          activeTokens={activeTokens}
          allTokens={allTokens}
          balances={balances}
          supportedTokenAddresses={[]}
          onSelectToken={(newTokenAddress) => {
            handleSetToken(showTokenSelectModal, newTokenAddress);
            setShowTokenSelectModal(null);
          }}
        />
      </Overlay>
      <Overlay
        title={t("information.counterParty.title")}
        onCloseButtonClick={() => toggleShowOrderTypeInfo()}
        isHidden={!showOrderTypeInfo}
      >
        <OrderTypesModal onCloseButtonClick={() => toggleShowOrderTypeInfo()} />
      </Overlay>
      <Overlay
        title={t("information.protocolFee.title")}
        onCloseButtonClick={() => toggleShowFeeInfo()}
        isHidden={!showFeeInfo}
      >
        <ProtocolFeeModal onCloseButtonClick={() => toggleShowFeeInfo()} />
      </Overlay>
    </Container>
  );
};

export default MakeWidget;
