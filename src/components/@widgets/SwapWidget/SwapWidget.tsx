import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import { Wrapper } from "@airswap/libraries";
import { OrderERC20, ADDRESS_ZERO } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  transformAddressAliasToAddress,
  transformAddressToAddressAlias,
} from "../../../constants/addressAliases";
import nativeCurrency, {
  nativeCurrencySafeTransactionFee,
} from "../../../constants/nativeCurrency";
import { InterfaceContext } from "../../../contexts/interface/Interface";
import { LastLookContext } from "../../../contexts/lastLook/LastLook";
import { AppErrorType } from "../../../errors/appError";
import transformUnknownErrorToAppError from "../../../errors/transformUnknownErrorToAppError";
import {
  requestActiveTokenAllowancesSwap,
  selectAllowances,
  selectBalances,
} from "../../../features/balances/balancesSlice";
import {
  fetchIndexerUrls,
  getFilteredOrders,
} from "../../../features/indexer/indexerActions";
import { selectIndexerReducer } from "../../../features/indexer/indexerSlice";
import {
  selectActiveTokens,
  selectAllTokenInfo,
} from "../../../features/metadata/metadataSlice";
import {
  approve,
  deposit,
  take,
  withdraw,
} from "../../../features/orders/ordersActions";
import { check } from "../../../features/orders/ordersHelpers";
import {
  clear,
  selectBestOption,
  selectBestOrder,
  selectOrdersErrors,
  selectOrdersStatus,
  setErrors,
  setResetStatus,
} from "../../../features/orders/ordersSlice";
import { fetchBestPricing } from "../../../features/quotes/quotesApi";
import useQuotes from "../../../features/quotes/quotesHooks";
import { selectAllSupportedTokens } from "../../../features/registry/registrySlice";
import {
  clearTradeTerms,
  clearTradeTermsQuoteAmount,
  selectTradeTerms,
  setTradeTerms,
  setTradeTermsQuoteAmount,
} from "../../../features/tradeTerms/tradeTermsSlice";
import {
  declineTransaction,
  revertTransaction,
} from "../../../features/transactions/transactionsActions";
import {
  selectCustomServerUrl,
  setCustomServerUrl,
  setUserTokens,
} from "../../../features/userSettings/userSettingsSlice";
import stringToSignificantDecimals from "../../../helpers/stringToSignificantDecimals";
import switchToDefaultChain from "../../../helpers/switchToDefaultChain";
import useAllowance from "../../../hooks/useAllowance";
import useAppRouteParams from "../../../hooks/useAppRouteParams";
import useApprovalPending from "../../../hooks/useApprovalPending";
import useDepositPending from "../../../hooks/useDepositPending";
import useInsufficientBalance from "../../../hooks/useInsufficientBalance";
import useMaxAmount from "../../../hooks/useMaxAmount";
import useNativeToken from "../../../hooks/useNativeToken";
import useNativeWrappedToken from "../../../hooks/useNativeWrappedToken";
import useReferencePriceSubscriber from "../../../hooks/useReferencePriceSubscriber";
import useSwapType from "../../../hooks/useSwapType";
import useTokenInfo from "../../../hooks/useTokenInfo";
import useWithdrawalPending from "../../../hooks/useWithdrawalPending";
import { AppRoutes } from "../../../routes";
import { TokenSelectModalTypes } from "../../../types/tokenSelectModalTypes";
import { TransactionStatusType } from "../../../types/transactionTypes";
import ApproveReview from "../../@reviewScreens/ApproveReview/ApproveReview";
import AvailableOrdersWidget from "../../AvailableOrdersWidget/AvailableOrdersWidget";
import { ErrorList } from "../../ErrorList/ErrorList";
import GasFreeSwapsModal from "../../InformationModals/subcomponents/GasFreeSwapsModal/GasFreeSwapsModal";
import ProtocolFeeModal from "../../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import Overlay from "../../Overlay/Overlay";
import SwapInputs from "../../SwapInputs/SwapInputs";
import { notifyRejectedByUserError } from "../../Toasts/ToastController";
import TokenList from "../../TokenList/TokenList";
import WalletSignScreen from "../../WalletSignScreen/WalletSignScreen";
import { Container } from "../MakeWidget/MakeWidget.styles";
import StyledSwapWidget, {
  ButtonContainer,
  InfoContainer,
} from "./SwapWidget.styles";
import getTokenPairs from "./helpers/getTokenPairs";
import useBestTradeOptionTransaction from "./hooks/useBestTradeOptionTransaction";
import useTokenOrFallback from "./hooks/useTokenOrFallback";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import InfoSection from "./subcomponents/InfoSection/InfoSection";
import SwapWidgetHeader from "./subcomponents/SwapWidgetHeader/SwapWidgetHeader";

export enum SwapWidgetState {
  overview = "overview",
  requestPrices = "requestPrices",
  review = "review",
}

const SwapWidget: FC = () => {
  // Redux
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation<{ isFromOrderDetailPage?: true }>();
  const isFromOrderDetailPage = !!location.state?.isFromOrderDetailPage;
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);
  const bestRfqOrder = useAppSelector(selectBestOrder);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const ordersErrors = useAppSelector(selectOrdersErrors);
  const bestTradeOption = useAppSelector(selectBestOption);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const supportedTokens = useAppSelector(selectAllSupportedTokens);
  const tradeTerms = useAppSelector(selectTradeTerms);
  const {
    indexerUrls,
    orders: indexerOrders,
    bestSwapOrder: bestIndexerOrder,
  } = useAppSelector(selectIndexerReducer);
  const customServerUrl = useAppSelector(selectCustomServerUrl);

  // Contexts
  const LastLook = useContext(LastLookContext);
  const {
    isConnecting,
    transactionsTabIsOpen,
    setShowWalletList,
    setTransactionsTabIsOpen,
  } = useContext(InterfaceContext);

  // Input states
  const appRouteParams = useAppRouteParams();
  const [tokenFrom, setTokenFrom] = useState<string | undefined>();
  const [tokenTo, setTokenTo] = useState<string | undefined>();
  const [baseAmount, setBaseAmount] = useState(
    isFromOrderDetailPage ? tradeTerms.baseAmount : ""
  );
  const [state, setState] = useState<SwapWidgetState>(SwapWidgetState.overview);

  // Pricing
  const { bestOrder, bestPricing } = useQuotes(
    tradeTerms.baseToken.address,
    tradeTerms.baseAmount,
    tradeTerms.quoteToken.address,
    state === SwapWidgetState.requestPrices
  );
  const {
    subscribeToTokenPrice,
    unsubscribeFromGasPrice,
    unsubscribeFromTokenPrice,
  } = useReferencePriceSubscriber();

  // Modals
  const [showOrderSubmitted, setShowOrderSubmitted] = useState<boolean>(false);
  const [showTokenSelectModalFor, setShowTokenSelectModalFor] =
    useState<TokenSelectModalTypes | null>(null);

  const [showGasFeeInfo, setShowGasFeeInfo] = useState(false);
  const [protocolFeeInfo, setProtocolFeeInfo] = useState(false);
  const [showViewAllQuotes, toggleShowViewAllQuotes] = useToggle();

  // Loading states
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isWrapping, setIsWrapping] = useState(false);
  const [isRequestingQuotes, setIsRequestingQuotes] = useState(false);

  // Error states
  const [pairUnavailable, setPairUnavailable] = useState(false);
  const [allowanceFetchFailed, setAllowanceFetchFailed] =
    useState<boolean>(false);

  const { t } = useTranslation();

  const {
    chainId,
    account,
    library,
    active,
    error: web3Error,
  } = useWeb3React<Web3Provider>();

  const baseToken = useTokenOrFallback(tokenFrom, tokenTo, true);
  const quoteToken = useTokenOrFallback(tokenFrom, tokenTo);

  const baseTokenInfo = useTokenInfo(baseToken);
  const quoteTokenInfo = useTokenInfo(quoteToken);
  const swapType = useSwapType(baseTokenInfo, quoteTokenInfo);
  const nativeTokenInfo = useNativeToken(chainId);
  const wrappedNativeTokenInfo = useNativeWrappedToken(chainId);
  const { hasSufficientAllowance, readableAllowance } = useAllowance(
    baseTokenInfo,
    baseAmount
  );
  const shouldApprove = !hasSufficientAllowance && swapType !== "wrapOrUnwrap";

  const hasApprovalPending = useApprovalPending(baseToken);
  const hasDepositPending = useDepositPending();
  const hasWithdrawalPending = useWithdrawalPending();
  const hasDepositOrWithdrawalPending =
    hasDepositPending || hasWithdrawalPending;
  const maxAmount = useMaxAmount(baseToken);
  const showMaxButton = !!maxAmount && baseAmount !== maxAmount;
  const showMaxInfoButton =
    !!maxAmount &&
    baseTokenInfo?.address === ADDRESS_ZERO &&
    !!nativeCurrencySafeTransactionFee[baseTokenInfo.chainId];

  useEffect(() => {
    setAllowanceFetchFailed(false);
    unsubscribeFromGasPrice();
    unsubscribeFromTokenPrice();
    dispatch(clear());
    LastLook.unsubscribeAllServers();
  }, [
    chainId,
    dispatch,
    LastLook,
    unsubscribeFromGasPrice,
    unsubscribeFromTokenPrice,
  ]);

  useEffect(() => {
    setTokenFrom(appRouteParams.tokenFrom);
    setTokenTo(appRouteParams.tokenTo);
  }, [appRouteParams]);

  useEffect(() => {
    if (ordersStatus === "reset") {
      setIsApproving(false);
      setIsSwapping(false);
      setIsRequestingQuotes(false);
      setAllowanceFetchFailed(false);
      setPairUnavailable(false);
      setProtocolFeeInfo(false);
      setShowGasFeeInfo(false);
      LastLook.unsubscribeAllServers();
    }
  }, [ordersStatus, LastLook, dispatch]);

  // Reset when the chainId changes.
  useEffect(() => {
    if (chainId) {
      dispatch(clear());
      dispatch(setResetStatus());
    }
  }, [chainId]);

  useEffect(() => {
    setAllowanceFetchFailed(
      allowances.swap.status === "failed" ||
        allowances.wrapper.status === "failed"
    );
  }, [allowances.swap.status, allowances.wrapper.status]);

  const quoteAmount =
    swapType === "wrapOrUnwrap"
      ? baseAmount
      : tradeTerms.quoteAmount || bestTradeOption?.quoteAmount || "";
  const formattedQuoteAmount = useMemo(
    () => stringToSignificantDecimals(quoteAmount),
    [quoteAmount]
  );

  const transactionOrderNonce =
    bestTradeOption?.order?.nonce || bestIndexerOrder?.nonce;
  const activeTransaction = useBestTradeOptionTransaction(
    baseTokenInfo,
    transactionOrderNonce,
    bestTradeOption?.quoteAmount
  );

  useEffect(() => {
    if (!active) {
      setShowTokenSelectModalFor(null);
    }
  }, [active]);

  useEffect(() => {
    if (!indexerUrls && library) {
      dispatch(fetchIndexerUrls({ provider: library }));
    }
  }, [indexerUrls, library]);

  useEffect(() => {
    if (indexerUrls && baseTokenInfo && quoteTokenInfo) {
      dispatch(
        getFilteredOrders({
          filter: {
            senderToken: baseTokenInfo.address,
            signerToken: quoteTokenInfo.address,
          },
        })
      );
    }
  }, [baseTokenInfo, indexerUrls, quoteTokenInfo]);

  // useEffect(() => {
  //   if (isFromOrderDetailPage && +tradeTerms.baseAmount) {
  //     prepareForRequest();
  //     requestQuotes();
  //   }
  // }, []);

  useEffect(() => {
    if (hasDepositOrWithdrawalPending) {
      setShowOrderSubmitted(true);
      setIsWrapping(false);
    }
  }, [hasDepositOrWithdrawalPending]);

  useEffect(() => {
    if (activeTransaction?.status === TransactionStatusType.processing) {
      setShowOrderSubmitted(true);
      setIsSwapping(false);
    }
  }, [activeTransaction]);

  const handleSetToken = (type: TokenSelectModalTypes, value: string) => {
    const baseRoute = AppRoutes.swap;
    const tokenPairs = getTokenPairs(type, value, quoteToken, baseToken);
    const tokenFrom = transformAddressAliasToAddress(tokenPairs.tokenFrom!);
    const tokenTo = transformAddressAliasToAddress(tokenPairs.tokenTo!);
    const tokenFromAlias = transformAddressToAddressAlias(tokenFrom);
    const tokenToAlias = transformAddressToAddressAlias(tokenTo);

    if (type === "base") {
      setBaseAmount("");
    }

    if (tokenFrom && tokenTo) {
      dispatch(setUserTokens({ tokenFrom, tokenTo }));
    }
    history.push({
      pathname: `/${baseRoute}/${tokenFromAlias || tokenFrom}/${
        tokenToAlias || tokenTo
      }`,
    });
  };

  const handleSwitchTokensButtonClick = () => {
    if (quoteToken) {
      handleSetToken("base", quoteToken);
    }
  };

  const insufficientBalance = useInsufficientBalance(baseTokenInfo, baseAmount);

  const handleRemoveActiveToken = (address: string) => {
    if (address === baseToken) {
      history.push({ pathname: `/${AppRoutes.swap}/-/${quoteToken || "-"}` });
      setBaseAmount("");
    } else if (address === quoteToken) {
      history.push({ pathname: `/${AppRoutes.swap}/${baseToken || "-"}/-` });
    }
  };

  const swapWithRequestForQuote = async () => {
    try {
      if (!library) return;
      const senderWallet =
        swapType === "swapWithWrap" ? Wrapper.getAddress(chainId!) : account!;
      if (!senderWallet) return;
      const errors = await check(
        bestTradeOption!.order!,
        senderWallet,
        chainId || 1,
        library,
        swapType === "swapWithWrap"
      );

      if (errors.length) {
        dispatch(setErrors(errors));
        setIsSwapping(false);
        return;
      }
      LastLook.unsubscribeAllServers();

      await dispatch(
        take(
          bestTradeOption!.order!,
          quoteTokenInfo!,
          baseTokenInfo!,
          library,
          swapType === "swapWithWrap" ? "Wrapper" : "Swap"
        )
      );
    } catch (e) {
      console.error("Error taking order:", e);
    }
  };

  const swapWithLastLook = async () => {
    let order: OrderERC20 | null = null;

    try {
      setIsSwapping(true);
      // Setting quote amount prevents the UI from updating if pricing changes
      dispatch(setTradeTermsQuoteAmount(bestTradeOption!.quoteAmount));
      // Last look order.
      const { order: lastLookOrder, senderWallet } =
        await LastLook.getSignedOrder({
          locator: bestTradeOption!.pricing!.locator,
          terms: { ...tradeTerms, quoteAmount: bestTradeOption!.quoteAmount },
        });
      order = lastLookOrder;
      let errors: any[] = [];
      if (library) {
        errors = await check(order, senderWallet, chainId || 1, library);
      }

      if (errors.length) {
        dispatch(setErrors(errors));
        setIsSwapping(false);
        return;
      }

      LastLook.sendOrderForConsideration({
        locator: bestTradeOption!.pricing!.locator,
        order: order,
      });

      setIsSwapping(false);
      setShowOrderSubmitted(true);
      LastLook.unsubscribeAllServers();
    } catch (e: any) {
      setIsSwapping(false);
      dispatch(clearTradeTermsQuoteAmount());

      const appError = transformUnknownErrorToAppError(e);
      if (appError.type === AppErrorType.rejectedByUser) {
        notifyRejectedByUserError();
        dispatch(
          revertTransaction({
            signerWallet: order?.signerWallet,
            nonce: order?.nonce,
            reason: e.message,
          })
        );
      } else {
        dispatch(setErrors([appError]));
      }

      console.error("Error taking order:", e);
    }
  };

  const prepareForRequest = useCallback(() => {
    dispatch(
      setTradeTerms({
        baseToken: {
          address: baseToken!,
          decimals: baseTokenInfo!.decimals,
        },
        baseAmount: baseAmount,
        quoteToken: {
          address: quoteToken!,
          decimals: quoteTokenInfo!.decimals,
        },
        quoteAmount: null,
        side: "sell",
      })
    );
    // subscribeToGasPrice();
    subscribeToTokenPrice(
      quoteTokenInfo!,
      // @ts-ignore
      library!,
      chainId!
    );
  }, [
    baseAmount,
    baseToken,
    baseTokenInfo,
    chainId,
    customServerUrl,
    library,
    quoteToken,
    quoteTokenInfo,
  ]);

  const takeBestOption = async () => {
    if (bestTradeOption?.isLastLook) {
      await swapWithLastLook();
    } else {
      await swapWithRequestForQuote();
    }
  };

  const doWrap = async () => {
    const method =
      baseTokenInfo === nativeCurrency[chainId!] ? deposit : withdraw;

    dispatch(
      method(
        baseAmount,
        nativeTokenInfo,
        wrappedNativeTokenInfo!,
        chainId!,
        library!
      )
    );
  };

  const handleActionButtonClick = async (action: ButtonActions) => {
    switch (action) {
      case ButtonActions.goBack:
        setPairUnavailable(false);
        dispatch(clearTradeTerms());
        dispatch(clear());
        unsubscribeFromGasPrice();
        unsubscribeFromTokenPrice();
        LastLook.unsubscribeAllServers();
        break;

      case ButtonActions.restart:
        setShowOrderSubmitted(false);
        setState(SwapWidgetState.overview);
        dispatch(clearTradeTerms());
        dispatch(clear());
        unsubscribeFromGasPrice();
        unsubscribeFromTokenPrice();
        LastLook.unsubscribeAllServers();
        setBaseAmount("");
        library &&
          dispatch(requestActiveTokenAllowancesSwap({ provider: library }));
        break;

      case ButtonActions.reloadPage:
        window.location.reload();
        break;

      case ButtonActions.connectWallet:
        setShowWalletList(true);
        break;

      case ButtonActions.switchNetwork:
        switchToDefaultChain();
        break;

      case ButtonActions.requestQuotes:
        setState(SwapWidgetState.requestPrices);

        prepareForRequest();

        break;

      case ButtonActions.approve:
        setState(SwapWidgetState.review);
        break;

      case ButtonActions.takeQuote:
        if (["swap", "swapWithWrap"].includes(swapType)) {
          await takeBestOption();
        } else if (swapType === "wrapOrUnwrap") {
          await doWrap();
        }
        break;

      case ButtonActions.trackTransaction:
        setTransactionsTabIsOpen(true);
        break;
    }
  };

  const approveToken = async () => {
    setIsApproving(true);

    await dispatch(
      approve(
        baseAmount,
        baseTokenInfo!,
        library!,
        swapType === "swapWithWrap" ? "Wrapper" : "Swap"
      )
    );
    setIsApproving(false);
  };

  const handleEditButtonClick = () => {
    setState(SwapWidgetState.overview);
  };

  const handleClearServerUrl = () => {
    dispatch(setCustomServerUrl(null));
  };

  const backToOverview = () => {
    handleActionButtonClick(ButtonActions.restart);
  };

  if (ordersStatus === "signing") {
    return (
      <Container>
        <WalletSignScreen />
      </Container>
    );
  }

  if (state === SwapWidgetState.review && shouldApprove) {
    return (
      <Container>
        <ApproveReview
          isLoading={hasApprovalPending}
          amount={baseAmount || "0"}
          errors={ordersErrors}
          readableAllowance={readableAllowance}
          token={baseTokenInfo}
          wrappedNativeToken={wrappedNativeTokenInfo}
          onEditButtonClick={handleEditButtonClick}
          onRestartButtonClick={backToOverview}
          onSignButtonClick={approveToken}
        />
      </Container>
    );
  }

  return (
    <>
      <StyledSwapWidget>
        <SwapWidgetHeader
          isLastLook={!!(bestTradeOption && bestTradeOption.isLastLook)}
          title={isApproving ? t("orders.approve") : t("common.rfq")}
          isQuote={!isRequestingQuotes && !showOrderSubmitted}
          onGasFreeTradeButtonClick={() => setShowGasFeeInfo(true)}
          expiry={bestTradeOption?.order?.expiry}
        />
        {!isApproving && !isSwapping && !showOrderSubmitted && (
          <SwapInputs
            baseAmount={baseAmount}
            baseTokenInfo={baseTokenInfo}
            quoteTokenInfo={quoteTokenInfo}
            side="sell"
            tradeNotAllowed={pairUnavailable}
            isRequestingQuoteAmount={isRequestingQuotes}
            // Note that using the quoteAmount from tradeTerms will stop this
            // updating when the user clicks the take button.
            quoteAmount={formattedQuoteAmount}
            disabled={!active || (!!quoteAmount && allowanceFetchFailed)}
            readOnly={
              !!bestTradeOption ||
              isWrapping ||
              isRequestingQuotes ||
              pairUnavailable ||
              !active
            }
            showMaxButton={showMaxButton}
            showMaxInfoButton={showMaxInfoButton}
            maxAmount={maxAmount}
            onBaseAmountChange={setBaseAmount}
            onChangeTokenClick={setShowTokenSelectModalFor}
            onMaxButtonClick={() => setBaseAmount(maxAmount || "0")}
            onSwitchTokensButtonClick={handleSwitchTokensButtonClick}
          />
        )}
        <InfoContainer>
          <InfoSection
            failedToFetchAllowances={allowanceFetchFailed}
            hasSelectedCustomServer={!!customServerUrl}
            isApproving={isApproving}
            isConnected={active}
            isFetchingOrders={isRequestingQuotes}
            isPairUnavailable={pairUnavailable}
            isSwapping={isSwapping}
            isWrapping={isWrapping}
            orderSubmitted={showOrderSubmitted}
            orderCompleted={
              showOrderSubmitted &&
              activeTransaction?.status === TransactionStatusType.succeeded
            }
            requiresApproval={bestRfqOrder && shouldApprove}
            showViewAllQuotes={indexerOrders.length > 0}
            // @ts-ignore
            bestTradeOption={bestTradeOption}
            baseTokenInfo={baseTokenInfo}
            baseAmount={baseAmount}
            serverUrl={customServerUrl}
            quoteTokenInfo={quoteTokenInfo}
            onClearServerUrlButtonClick={handleClearServerUrl}
            onFeeButtonClick={() => setProtocolFeeInfo(true)}
            onViewAllQuotesButtonClick={() => toggleShowViewAllQuotes()}
          />
        </InfoContainer>
        <ButtonContainer>
          {!isApproving && !isSwapping && (
            <ActionButtons
              walletIsActive={active}
              unsupportedNetwork={
                !!web3Error && web3Error instanceof UnsupportedChainIdError
              }
              requiresReload={allowanceFetchFailed}
              orderComplete={showOrderSubmitted}
              baseTokenInfo={baseTokenInfo}
              quoteTokenInfo={quoteTokenInfo}
              hasAmount={
                !!baseAmount.length && baseAmount !== "0" && baseAmount !== "."
              }
              hasQuote={
                !isRequestingQuotes && (!!bestTradeOption || isWrapping)
              }
              hasSufficientBalance={!insufficientBalance}
              needsApproval={!!baseToken && shouldApprove}
              pairUnavailable={pairUnavailable}
              onButtonClicked={(action) => handleActionButtonClick(action)}
              isLoading={isConnecting || isRequestingQuotes}
              transactionsTabOpen={transactionsTabIsOpen}
            />
          )}
        </ButtonContainer>
      </StyledSwapWidget>
      <Overlay
        onCloseButtonClick={() => setShowTokenSelectModalFor(null)}
        isHidden={!showTokenSelectModalFor}
      >
        <TokenList
          onSelectToken={(newTokenAddress) => {
            // e.g. handleSetToken("base", "0x123")
            handleSetToken(showTokenSelectModalFor, newTokenAddress);
            // Close the modal
            setShowTokenSelectModalFor(null);
          }}
          balances={balances}
          allTokens={allTokens}
          activeTokens={activeTokens}
          supportedTokenAddresses={supportedTokens}
          onAfterRemoveActiveToken={handleRemoveActiveToken}
        />
      </Overlay>
      <Overlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onCloseButtonClick={backToOverview}
        isHidden={!ordersErrors.length}
      >
        <ErrorList errors={ordersErrors} onBackButtonClick={backToOverview} />
      </Overlay>
      <Overlay
        title={t("information.gasFreeSwaps.title")}
        onCloseButtonClick={() => setShowGasFeeInfo(false)}
        isHidden={!showGasFeeInfo}
      >
        <GasFreeSwapsModal
          onCloseButtonClick={() => setShowGasFeeInfo(false)}
        />
      </Overlay>
      <Overlay
        title={t("information.protocolFee.title")}
        onCloseButtonClick={() => setProtocolFeeInfo(false)}
        isHidden={!protocolFeeInfo}
      >
        <ProtocolFeeModal
          onCloseButtonClick={() => setProtocolFeeInfo(false)}
        />
      </Overlay>
      {baseTokenInfo && quoteTokenInfo && (
        <Overlay
          title={t("orders.availableOrders")}
          isHidden={!showViewAllQuotes}
          onCloseButtonClick={() => toggleShowViewAllQuotes()}
        >
          <AvailableOrdersWidget
            senderToken={baseTokenInfo}
            signerToken={quoteTokenInfo}
            onSwapLinkClick={() => toggleShowViewAllQuotes()}
          />
        </Overlay>
      )}
    </>
  );
};

export default SwapWidget;
