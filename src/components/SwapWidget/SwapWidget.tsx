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

import { Protocols } from "@airswap/constants";
import { Server, Registry, Wrapper } from "@airswap/libraries";
import { OrderERC20, Pricing } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { useToggle } from "@react-hookz/web";
import { unwrapResult } from "@reduxjs/toolkit";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  transformAddressToAddressAlias,
  transformAddressAliasToAddress,
} from "../../constants/addressAliases";
import {
  ADDITIONAL_QUOTE_BUFFER,
  RECEIVE_QUOTE_TIMEOUT_MS,
} from "../../constants/configParams";
import nativeCurrency, {
  nativeCurrencyAddress,
  nativeCurrencySafeTransactionFee,
} from "../../constants/nativeCurrency";
import { InterfaceContext } from "../../contexts/interface/Interface";
import { LastLookContext } from "../../contexts/lastLook/LastLook";
import { AppErrorType } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import {
  selectAllowances,
  selectBalances,
} from "../../features/balances/balancesSlice";
import {
  fetchIndexerUrls,
  getFilteredOrders,
  selectIndexerReducer,
} from "../../features/indexer/indexerSlice";
import {
  selectActiveTokens,
  selectAllTokenInfo,
} from "../../features/metadata/metadataSlice";
import { check } from "../../features/orders/orderApi";
import {
  approve,
  clear,
  deposit,
  request,
  resetOrders,
  selectBestOption,
  selectBestOrder,
  selectOrdersErrors,
  selectOrdersStatus,
  setErrors,
  take,
  withdraw,
} from "../../features/orders/ordersSlice";
import { selectAllSupportedTokens } from "../../features/registry/registrySlice";
import {
  clearTradeTerms,
  clearTradeTermsQuoteAmount,
  selectTradeTerms,
  setTradeTerms,
  setTradeTermsQuoteAmount,
} from "../../features/tradeTerms/tradeTermsSlice";
import {
  declineTransaction,
  revertTransaction,
} from "../../features/transactions/transactionActions";
import { ProtocolType } from "../../features/transactions/transactionsSlice";
import {
  setUserTokens,
  setCustomServerUrl,
  selectCustomServerUrl,
} from "../../features/userSettings/userSettingsSlice";
import getWethAddress from "../../helpers/getWethAddress";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import switchToDefaultChain from "../../helpers/switchToDefaultChain";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import useApprovalPending from "../../hooks/useApprovalPending";
import useInsufficientBalance from "../../hooks/useInsufficientBalance";
import useMaxAmount from "../../hooks/useMaxAmount";
import useReferencePriceSubscriber from "../../hooks/useReferencePriceSubscriber";
import useSwapType from "../../hooks/useSwapType";
import useTokenInfo from "../../hooks/useTokenInfo";
import { AppRoutes } from "../../routes";
import { TokenSelectModalTypes } from "../../types/tokenSelectModalTypes";
import AvailableOrdersWidget from "../AvailableOrdersWidget/AvailableOrdersWidget";
import { ErrorList } from "../ErrorList/ErrorList";
import GasFreeSwapsModal from "../InformationModals/subcomponents/GasFreeSwapsModal/GasFreeSwapsModal";
import ProtocolFeeModal from "../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import { Container } from "../MakeWidget/MakeWidget.styles";
import Overlay from "../Overlay/Overlay";
import SwapInputs from "../SwapInputs/SwapInputs";
import {
  notifyError,
  notifyRejectedByUserError,
} from "../Toasts/ToastController";
import TokenList from "../TokenList/TokenList";
import WalletSignScreen from "../WalletSignScreen/WalletSignScreen";
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

  // Pricing
  const {
    subscribeToGasPrice,
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

  const hasApprovalPending = useApprovalPending(baseToken);
  const maxAmount = useMaxAmount(baseToken);
  const showMaxButton = !!maxAmount && baseAmount !== maxAmount;
  const showMaxInfoButton =
    !!maxAmount &&
    baseTokenInfo?.address === nativeCurrencyAddress &&
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
      setIsWrapping(false);
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
      dispatch(resetOrders());
    }
  }, [chainId]);

  useEffect(() => {
    setAllowanceFetchFailed(
      allowances.swap.status === "failed" ||
        allowances.wrapper.status === "failed"
    );
  }, [allowances.swap.status, allowances.wrapper.status]);

  const swapType = useSwapType(baseTokenInfo, quoteTokenInfo);
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
            senderTokens: [baseTokenInfo.address],
            signerTokens: [quoteTokenInfo.address],
          },
        })
      );
    }
  }, [baseTokenInfo, indexerUrls, quoteTokenInfo]);

  useEffect(() => {
    if (isFromOrderDetailPage && +tradeTerms.baseAmount) {
      prepareForRequest();
      requestQuotes();
    }
  }, []);

  const hasSufficientAllowance = (tokenAddress: string | undefined) => {
    if (tokenAddress === nativeCurrency[chainId || 1].address) return true;
    if (!tokenAddress) return false;
    if (
      allowances[swapType === "swapWithWrap" ? "wrapper" : "swap"].values[
        tokenAddress
      ] === undefined
    ) {
      // We don't currently know what the user's allowance is, this is an error
      // state we shouldn't repeatedly hit, so we'll prompt a reload.
      if (!allowanceFetchFailed) setAllowanceFetchFailed(true);
      // safter to return true here (has allowance) as validator will catch the
      // missing allowance, so the user won't swap, and they won't pay
      // unnecessary gas for an approval they may not need.
      return true;
    }
    return new BigNumber(
      allowances[swapType === "swapWithWrap" ? "wrapper" : "swap"].values[
        tokenAddress
      ]!
    )
      .div(10 ** (baseTokenInfo?.decimals || 18))
      .gte(baseAmount);
  };

  const handleSetToken = (type: TokenSelectModalTypes, value: string) => {
    const baseRoute = `/${AppRoutes.swap}`;
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

  const requestQuotes = useCallback(async () => {
    if (swapType === "wrapOrUnwrap") {
      // This will re-render with a 1:1 price and a take button.
      setIsWrapping(true);
      return;
    }
    setIsRequestingQuotes(true);

    const usesWrapper = swapType === "swapWithWrap";
    const weth = getWethAddress(chainId!);
    const eth = nativeCurrency[chainId!];
    const _quoteToken = quoteToken === eth.address ? weth : quoteToken!;
    const _baseToken = baseToken === eth.address ? weth : baseToken!;

    let rfqServers: Server[] = [];
    let lastLookServers: Server[] = [];
    try {
      try {
        if (library && customServerUrl) {
          const serverFromQueryString = await Server.at(customServerUrl, {
            chainId,
            initializeTimeout: 10 * 1000,
          });
          rfqServers.push(serverFromQueryString);
        } else if (library && chainId) {
          const servers = await Registry.getServers(
            library,
            chainId,
            _quoteToken,
            _baseToken,
            {
              initializeTimeout: 10 * 1000,
            }
          );
          rfqServers = servers.filter((s) =>
            s.supportsProtocol(Protocols.RequestForQuoteERC20)
          );
          lastLookServers = servers.filter((s) =>
            s.supportsProtocol(Protocols.LastLookERC20)
          );
        }
      } catch (e) {
        console.error("Error requesting orders:", e);
        throw new Error("error requesting orders");
      }

      let rfqPromise: Promise<OrderERC20[]> | null = null,
        lastLookPromises: Promise<Pricing>[] | null = null;

      if (rfqServers.length) {
        let rfqDispatchResult = dispatch(
          request({
            servers: rfqServers,
            senderToken: _baseToken,
            senderAmount: baseAmount,
            signerToken: _quoteToken,
            senderTokenDecimals: baseTokenInfo!.decimals,
            senderWallet: usesWrapper ? Wrapper.getAddress(chainId!) : account!,
            proxyingFor: usesWrapper ? account! : undefined,
          })
        );
        rfqPromise = rfqDispatchResult
          .then((result) => {
            return unwrapResult(result);
          })
          .then((orders) => {
            if (!orders.length) throw new Error("no valid orders");
            return orders;
          });
      }

      if (lastLookServers.length) {
        if (usesWrapper) {
          lastLookServers.forEach((s) => s.disconnect());
        } else {
          lastLookPromises = LastLook.subscribeAllServers(lastLookServers, {
            baseToken: baseToken!,
            quoteToken: quoteToken!,
          });
        }
      }

      let orderPromises: Promise<OrderERC20[] | Pricing>[] = [];
      if (rfqPromise) orderPromises.push(rfqPromise);
      if (lastLookPromises) {
        orderPromises = orderPromises.concat(lastLookPromises);
      }

      // This promise times out if _no_ orders are received before the timeout
      // but resolves if _any_ are.
      const timeoutOnNoOrdersPromise = Promise.race<any>([
        Promise.any(orderPromises),
        new Promise((_, reject) =>
          setTimeout(() => {
            reject("no valid orders");
          }, RECEIVE_QUOTE_TIMEOUT_MS)
        ),
      ]);

      // This promise resolves either when all orders are received or X seconds
      // after the first order is received.
      const waitExtraForAllOrdersPromise = Promise.race<any>([
        Promise.allSettled(orderPromises),
        Promise.any(orderPromises).then(
          () =>
            new Promise((resolve) =>
              setTimeout(resolve, ADDITIONAL_QUOTE_BUFFER)
            )
        ),
      ]);

      await Promise.all([
        waitExtraForAllOrdersPromise,
        timeoutOnNoOrdersPromise,
      ]);
    } catch (e: any) {
      switch (e.message) {
        case "error requesting orders": {
          notifyError({
            heading: t("orders.errorRequesting"),
            cta: t("orders.errorRequestingCta"),
          });
          break;
        }

        default: {
          console.error(e);
          setPairUnavailable(true);
        }
      }
    } finally {
      setIsRequestingQuotes(false);
    }
  }, [
    LastLook,
    account,
    baseAmount,
    baseToken,
    baseTokenInfo,
    chainId,
    dispatch,
    library,
    quoteToken,
    swapType,
    t,
  ]);

  const swapWithRequestForQuote = async () => {
    try {
      if (!library) return;
      const errors = await check(
        bestTradeOption!.order!,
        swapType === "swapWithWrap" ? Wrapper.getAddress(chainId!) : account!,
        chainId || 1,
        library
      );

      // If swapping with wrapper then ignore sender errors.
      if (swapType === "swapWithWrap") {
        for (let i = errors.length - 1; i >= 0; i--) {
          if (
            errors[i].type === AppErrorType.senderAllowanceLow ||
            errors[i].type === AppErrorType.senderBalanceLow
          ) {
            errors.splice(i, 1);
          }
        }
      }
      if (errors.length) {
        dispatch(setErrors(errors));
        setIsSwapping(false);
        return;
      }
      LastLook.unsubscribeAllServers();

      const result = await dispatch(
        take({
          order: bestTradeOption!.order!,
          library,
          contractType: swapType === "swapWithWrap" ? "Wrapper" : "Swap",
          onExpired: () => {
            notifyError({
              heading: t("orders.swapExpired"),
              cta: t("orders.swapExpiredCallToAction"),
            });
          },
        })
      );
      setIsSwapping(false);
      await unwrapResult(result);
      setShowOrderSubmitted(true);
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
      const accepted = await LastLook.sendOrderForConsideration({
        locator: bestTradeOption!.pricing!.locator,
        order: order,
      });
      setIsSwapping(false);
      if (accepted) {
        setShowOrderSubmitted(true);
        LastLook.unsubscribeAllServers();
      } else {
        notifyError({
          heading: t("orders.swapRejected"),
          cta: t("orders.swapRejectedCallToAction"),
        });

        dispatch(
          declineTransaction({
            signerWallet: order.signerWallet,
            nonce: order.nonce,
            reason: "Pricing expired",
          })
        );
      }
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
    if (bestTradeOption!.protocol === "request-for-quote-erc20") {
      await swapWithRequestForQuote();
    } else {
      await swapWithLastLook();
    }
  };

  const doWrap = async () => {
    const method =
      baseTokenInfo === nativeCurrency[chainId!] ? deposit : withdraw;
    setIsSwapping(true);
    try {
      const result = await dispatch(
        method({
          chainId: chainId!,
          senderAmount: baseAmount,
          senderTokenDecimals: baseTokenInfo!.decimals,
          provider: library!,
        })
      );
      await unwrapResult(result);
      setIsSwapping(false);
      setIsWrapping(false);
      setShowOrderSubmitted(true);
    } catch (e) {
      // user cancelled metamask dialog
      setIsSwapping(false);
      setIsWrapping(false);
    }
  };

  const handleActionButtonClick = async (action: ButtonActions) => {
    switch (action) {
      case ButtonActions.goBack:
        setIsWrapping(false);
        setPairUnavailable(false);
        dispatch(clearTradeTerms());
        dispatch(clear());
        unsubscribeFromGasPrice();
        unsubscribeFromTokenPrice();
        LastLook.unsubscribeAllServers();
        break;

      case ButtonActions.restart:
        setShowOrderSubmitted(false);
        // setValidatorErrors([]);
        dispatch(clearTradeTerms());
        dispatch(clear());
        unsubscribeFromGasPrice();
        unsubscribeFromTokenPrice();
        LastLook.unsubscribeAllServers();
        setBaseAmount("");
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
        prepareForRequest();
        await requestQuotes();

        break;

      case ButtonActions.approve:
        setIsApproving(true);

        await dispatch(
          approve({
            token: baseTokenInfo!,
            library,
            contractType: swapType === "swapWithWrap" ? "Wrapper" : "Swap",
            chainId: chainId!,
            amount: baseAmount,
          })
        );
        setIsApproving(false);
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

      default:
      // Do nothing.
    }
  };

  const handleClearServerUrl = () => {
    dispatch(setCustomServerUrl(null));
  };

  if (ordersStatus === "signing") {
    return (
      <Container>
        <WalletSignScreen />
      </Container>
    );
  }

  return (
    <>
      <StyledSwapWidget>
        <SwapWidgetHeader
          title={isApproving ? t("orders.approve") : t("common.rfq")}
          isQuote={!isRequestingQuotes && !showOrderSubmitted}
          onGasFreeTradeButtonClick={() => setShowGasFeeInfo(true)}
          protocol={bestTradeOption?.protocol as ProtocolType}
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
              showOrderSubmitted && activeTransaction?.status === "succeeded"
            }
            requiresApproval={
              bestRfqOrder && !hasSufficientAllowance(baseToken!)
            }
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
              needsApproval={!!baseToken && !hasSufficientAllowance(baseToken)}
              pairUnavailable={pairUnavailable}
              onButtonClicked={(action) => handleActionButtonClick(action)}
              isLoading={
                isConnecting || isRequestingQuotes || hasApprovalPending
              }
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
        onCloseButtonClick={() =>
          handleActionButtonClick(ButtonActions.restart)
        }
        isHidden={!ordersErrors.length}
      >
        <ErrorList
          errors={ordersErrors}
          onBackButtonClick={() =>
            handleActionButtonClick(ButtonActions.restart)
          }
        />
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
