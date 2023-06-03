import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { WETH } from "@airswap/libraries";
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
import useStringToSignificantDecimals from "../../hooks/useStringToSignificantDecimals";
import useSufficientAllowance from "../../hooks/useSufficientAllowance";
import useTokenAddress from "../../hooks/useTokenAddress";
import useTokenAmountError from "../../hooks/useTokenAmountError";
import useTokenInfo from "../../hooks/useTokenInfo";
import { AppRoutes } from "../../routes";
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
  StyledActionButtons,
  StyledAddressInput,
  StyledInfoSection,
  StyledInputSection,
  StyledOrderTypeSelector,
  StyledRateField,
  StyledReviewApprovalInfo,
  StyledTooltip,
  TooltipContainer,
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
  const protocolFee = useAppSelector(selectProtocolFee);
  const { indexerUrls } = useAppSelector(selectIndexerReducer);
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
  const formattedMakerAmount = useStringToSignificantDecimals(makerAmount, 4);
  const formattedTakerAmount = useStringToSignificantDecimals(takerAmount, 4);

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
  const makerAmountError = useTokenAmountError(
    makerTokenInfo,
    formattedMakerAmount
  );
  const takerAmountError = useTokenAmountError(
    takerTokenInfo,
    formattedTakerAmount
  );
  const hasMissingMakerAmount =
    !makerAmount.length ||
    parseFloat(makerAmount) === 0 ||
    makerAmount === "." ||
    !!makerAmountError;
  const hasMissingTakerAmount =
    !takerAmount.length ||
    parseFloat(takerAmount) === 0 ||
    takerAmount === "." ||
    !!takerAmountError;
  const maxAmount = useMaxAmount(makerTokenInfo?.address || null, true);
  const showMaxButton = !!maxAmount && makerAmount !== maxAmount;
  const showMaxInfoButton =
    !!maxAmount &&
    makerTokenInfo?.address === nativeCurrencyAddress &&
    !!nativeCurrencySafeTransactionFee[makerTokenInfo.chainId];
  const hasApprovalPending = useApprovalPending(makerTokenInfo?.address);
  const shouldDepositNativeTokenAmount =
    useShouldDepositNativeToken(makerAmount);
  const shouldDepositNativeToken = !!shouldDepositNativeTokenAmount;
  const [showReviewErc20Approval, setShowReviewErc20Approval] = useState(false);
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
    dispatch(fetchIndexerUrls({ provider: library! }));
  }, [dispatch, library]);

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

  useEffect(() => {
    if (hasApprovalPending) {
      setShowReviewErc20Approval(false);
    }
  }, [hasApprovalPending]);

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

  const handleSwitchTokensButtonClick = () => {
    handleSetToken("base", userTokens.tokenTo || defaultTokenToAddress);
    setMakerAmount(takerAmount);
    setTakerAmount(makerAmount);
  };

  const createOrder = () => {
    const expiryDate = Date.now() + expiry;
    const makerTokenAddress = makerTokenInfo?.address!;
    const takerTokenAddress = takerTokenInfo?.address!;

    const signerToken =
      makerTokenAddress === nativeCurrencyAddress
        ? WETH.getAddress(chainId!)
        : makerTokenAddress;
    const senderToken =
      takerTokenAddress === nativeCurrencyAddress
        ? WETH.getAddress(chainId!)
        : takerTokenAddress;

    setMakerAmount(formattedMakerAmount);
    setTakerAmount(formattedTakerAmount);

    dispatch(
      createOtcOrder({
        nonce: expiryDate.toString(),
        expiry: Math.floor(expiryDate / 1000).toString(),
        signerWallet: account!,
        signerToken,
        signerTokenInfo: makerTokenInfo!,
        signerAmount: formattedMakerAmount,
        protocolFee: protocolFee.toString(),
        senderWallet:
          orderType === OrderType.private
            ? takerAddress!
            : nativeCurrencyAddress,
        senderToken,
        senderTokenInfo: takerTokenInfo!,
        senderAmount: formattedTakerAmount,
        chainId: chainId!,
        library: library!,
        activeIndexers: indexerUrls,
        nativeCurrencyAddress: nativeCurrencyAddress,
      })
    );
  };

  const approveToken = () => {
    const tokenAddress = makerTokenInfo?.address!;

    dispatch(
      approve({
        token:
          tokenAddress === nativeCurrencyAddress
            ? WETH.getAddress(chainId!)
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
        senderAmount: shouldDepositNativeTokenAmount!,
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
      setShowReviewErc20Approval(true);
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

  const handleAddressInputChange = (value: string) => {
    setTakerAddress(value);
    if (error?.type === AppErrorType.invalidAddress) {
      dispatch(setError(undefined));
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
        readOnly={status === "signing" || !active}
        showMaxButton={showMaxButton}
        showMaxInfoButton={showMaxInfoButton}
        baseAmount={makerAmount}
        baseTokenInfo={makerTokenInfo}
        baseAmountError={makerAmountError}
        baseAmountSubText={`${protocolFee / 100}% ${t("common.fee")}`}
        maxAmount={maxAmount}
        side="sell"
        quoteAmount={takerAmount}
        quoteAmountError={takerAmountError}
        quoteTokenInfo={takerTokenInfo}
        onBaseAmountChange={setMakerAmount}
        onChangeTokenClick={setShowTokenSelectModal}
        onMaxButtonClick={() => setMakerAmount(maxAmount || "0")}
        onQuoteAmountChange={setTakerAmount}
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
              {t("validatorErrors.invalidAddress", { address: takerAddress })}
            </StyledTooltip>
          )}
        </TooltipContainer>
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
      {makerTokenInfo && makerAmount && showReviewErc20Approval && (
        <StyledReviewApprovalInfo
          amount={makerAmount}
          amountPlusFee={makerAmountPlusFee}
          tokenInfo={makerTokenInfo}
        />
      )}
      <StyledActionButtons
        hasInsufficientExpiry={expiry === 0}
        hasInsufficientAllowance={hasInsufficientAllowance}
        hasInsufficientBalance={hasInsufficientBalance}
        hasMissingMakerAmount={hasMissingMakerAmount}
        hasMissingMakerToken={!makerTokenInfo}
        hasMissingTakerAmount={hasMissingTakerAmount}
        hasMissingTakerToken={!takerTokenInfo}
        hasTokenAmountError={!!(makerAmountError || takerAmountError)}
        isLoading={hasApprovalPending || hasDepositPending}
        networkIsUnsupported={
          !!web3Error && web3Error instanceof UnsupportedChainIdError
        }
        shouldDepositNativeToken={shouldDepositNativeToken}
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
    </Container>
  );
};

export default MakeWidget;
