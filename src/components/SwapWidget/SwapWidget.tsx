import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { wethAddresses } from "@airswap/constants";
import { Registry, Wrapper, Swap } from "@airswap/libraries";
import { findTokensBySymbol } from "@airswap/metadata";
import { Order, Pricing } from "@airswap/typescript";
import { Web3Provider } from "@ethersproject/providers";
import { unwrapResult } from "@reduxjs/toolkit";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  ADDITIONAL_QUOTE_BUFFER,
  RECEIVE_QUOTE_TIMEOUT_MS,
} from "../../constants/configParams";
import { ErrorType } from "../../constants/errors";
import nativeETH from "../../constants/nativeETH";
import { LastLookContext } from "../../contexts/lastLook/LastLook";
import {
  requestActiveTokenAllowancesSwap,
  requestActiveTokenAllowancesWrapper,
  requestActiveTokenBalances,
  selectAllowances,
  selectBalances,
} from "../../features/balances/balancesSlice";
import {
  addActiveToken,
  removeActiveToken,
  selectActiveTokens,
  selectAllTokenInfo,
} from "../../features/metadata/metadataSlice";
import {
  approve,
  clear,
  deposit,
  request,
  resetOrders,
  selectBestOption,
  selectBestOrder,
  selectOrdersError,
  selectOrdersStatus,
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
import {
  ProtocolType,
  selectPendingApprovals,
} from "../../features/transactions/transactionsSlice";
import {
  setUserTokens,
  selectUserTokens,
} from "../../features/userSettings/userSettingsSlice";
import { setActiveProvider } from "../../features/wallet/walletSlice";
import findEthOrTokenByAddress from "../../helpers/findEthOrTokenByAddress";
import useAppRouteParams from "../../hooks/useAppRouteParams";
import useReferencePriceSubscriber from "../../hooks/useReferencePriceSubscriber";
import { AppRoutes } from "../../routes";
import { ErrorList } from "../ErrorList/ErrorList";
import { InformationModalType } from "../InformationModals/InformationModals";
import GasFreeSwapsModal from "../InformationModals/subcomponents/GasFreeSwapsModal/GasFreeSwapsModal";
import JoinModal from "../InformationModals/subcomponents/JoinModal/JoinModal";
import ProtocolFeeDiscountModal from "../InformationModals/subcomponents/ProtocolFeeDiscountModal/ProtocolFeeDiscountModal";
import Overlay from "../Overlay/Overlay";
import { notifyError } from "../Toasts/ToastController";
import TokenList from "../TokenList/TokenList";
import InfoSection from "./InfoSection";
import StyledSwapWidget, {
  ButtonContainer,
  HugeTicks,
  InfoContainer,
  StyledWalletProviderList,
} from "./SwapWidget.styles";
import getTokenPairs from "./helpers/getTokenPairs";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import SwapInputs from "./subcomponents/SwapInputs/SwapInputs";
import SwapWidgetHeader from "./subcomponents/SwapWidgetHeader/SwapWidgetHeader";

export type TokenSelectModalTypes = "base" | "quote" | null;
type SwapType = "swap" | "swapWithWrap" | "wrapOrUnwrap";

const initialBaseAmount = "";

type SwapWidgetPropsType = {
  showWalletList: boolean;
  transactionsTabOpen: boolean;
  activeInformationModal?: InformationModalType;
  setShowWalletList: (x: boolean) => void;
  onTrackTransactionClicked: () => void;
  onInformationModalCloseButtonClick: () => void;
};

const SwapWidget: FC<SwapWidgetPropsType> = ({
  showWalletList,
  activeInformationModal,
  setShowWalletList,
  transactionsTabOpen,
  onTrackTransactionClicked,
  onInformationModalCloseButtonClick,
}) => {
  // Redux
  const dispatch = useAppDispatch();
  const history = useHistory();
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);
  const bestRfqOrder = useAppSelector(selectBestOrder);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const ordersError = useAppSelector(selectOrdersError);
  const bestTradeOption = useAppSelector(selectBestOption);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const supportedTokens = useAppSelector(selectAllSupportedTokens);
  const pendingApprovals = useAppSelector(selectPendingApprovals);
  const tradeTerms = useAppSelector(selectTradeTerms);
  const userTokens = useAppSelector(selectUserTokens);

  // Contexts
  const LastLook = useContext(LastLookContext);

  // Input states
  const appRouteParams = useAppRouteParams();
  const [tokenFrom, setTokenFrom] = useState<string | undefined>();
  const [tokenTo, setTokenTo] = useState<string | undefined>();
  const [baseAmount, setBaseAmount] = useState(initialBaseAmount);

  // Pricing
  const {
    subscribeToGasPrice,
    subscribeToTokenPrice,
    unsubscribeFromGasPrice,
    unsubscribeFromTokenPrice,
  } = useReferencePriceSubscriber();

  // Modals
  const [showOrderSubmitted, setShowOrderSubmitted] = useState<boolean>(false);
  const [
    showTokenSelectModalFor,
    setShowTokenSelectModalFor,
  ] = useState<TokenSelectModalTypes | null>(null);
  const [showGasFeeInfo, setShowGasFeeInfo] = useState(false);
  const [protocolFeeDiscountInfo, setProtocolFeeDiscountInfo] = useState(false);

  // Loading states
  const [isApproving, setIsApproving] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isWrapping, setIsWrapping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRequestingQuotes, setIsRequestingQuotes] = useState(false);

  // Error states
  const [pairUnavailable, setPairUnavailable] = useState(false);
  const [validatorErrors, setValidatorErrors] = useState<ErrorType[]>(['NONCE_ALREADY_USED', 'chainDisconnected']);
  const [allowanceFetchFailed, setAllowanceFetchFailed] = useState<boolean>(
    false
  );

  const { t } = useTranslation();

  const {
    chainId,
    account,
    library,
    active,
    activate,
    error: web3Error,
  } = useWeb3React<Web3Provider>();

  const defaultBaseTokenAddress: string | null = allTokens.length
    ? findTokensBySymbol("USDT", allTokens)[0]?.address
    : null;
  const defaultQuoteTokenAddress: string | null = allTokens.length
    ? findTokensBySymbol("WETH", allTokens)[0]?.address
    : null;

  // Use default tokens only if neither are specified in the URL or store.
  const baseToken = tokenFrom
    ? tokenFrom
    : tokenTo
    ? null
    : userTokens.tokenFrom || defaultBaseTokenAddress;
  const quoteToken = tokenTo
    ? tokenTo
    : tokenFrom
    ? null
    : userTokens.tokenTo || defaultQuoteTokenAddress;

  const baseTokenInfo = useMemo(
    () =>
      baseToken
        ? findEthOrTokenByAddress(baseToken, activeTokens, chainId!)
        : null,
    [baseToken, activeTokens, chainId]
  );

  const quoteTokenInfo = useMemo(
    () =>
      quoteToken
        ? findEthOrTokenByAddress(quoteToken, activeTokens, chainId!)
        : null,
    [quoteToken, activeTokens, chainId]
  );

  const maxAmount = useMemo(() => {
    if (
      !baseToken ||
      !balances ||
      !baseTokenInfo ||
      !balances.values[baseToken] ||
      balances.values[baseToken] === "0"
    ) {
      return null;
    }

    return formatUnits(
      balances.values[baseToken] || "0",
      baseTokenInfo.decimals
    );
  }, [balances, baseToken, baseTokenInfo]);

  useEffect(() => {
    setAllowanceFetchFailed(false);
    setBaseAmount(initialBaseAmount);
    dispatch(clearTradeTerms());
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
      setProtocolFeeDiscountInfo(false);
      setShowGasFeeInfo(false);
      setBaseAmount(initialBaseAmount);
      LastLook.unsubscribeAllServers();
    }
  }, [ordersStatus, LastLook, dispatch]);

  // Reset when the chainId changes.
  useEffect(() => {
    if (chainId) {
      dispatch(resetOrders());
    }
  }, [chainId, dispatch]);

  useEffect(() => {
    setAllowanceFetchFailed(
      allowances.swap.status === "failed" ||
        allowances.wrapper.status === "failed"
    );
  }, [allowances.swap.status, allowances.wrapper.status]);

  useEffect(() => {
    if (ordersError === 'userRejectedRequest') {
      notifyError({
        heading: t("orders.swapFailed"),
        cta: t("orders.swapRejectedByUser"),
      });
    }

    if (ordersError && ordersError !== 'userRejectedRequest') {
      setValidatorErrors([ordersError]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersError]);

  let swapType: SwapType = "swap";

  if (chainId && baseToken && quoteToken) {
    const eth = nativeETH[chainId].address;
    const weth = wethAddresses[chainId];
    if ([weth, eth].includes(baseToken) && [weth, eth].includes(quoteToken)) {
      swapType = "wrapOrUnwrap";
    } else if ([quoteToken, baseToken].includes(eth)) {
      swapType = "swapWithWrap";
    }
  }

  const quoteAmount =
    swapType === "wrapOrUnwrap"
      ? baseAmount
      : tradeTerms.quoteAmount || bestTradeOption?.quoteAmount || "";

  const hasApprovalPending = (tokenId: string | undefined) => {
    if (tokenId === undefined) return false;
    return pendingApprovals.some((tx) => tx.tokenAddress === tokenId);
  };

  const hasSufficientAllowance = (tokenAddress: string | undefined) => {
    if (tokenAddress === nativeETH[chainId || 1].address) return true;
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
    const baseRoute = `${appRouteParams.justifiedBaseUrl}/${AppRoutes.swap}`;
    const { tokenFrom, tokenTo } = getTokenPairs(
      type,
      value,
      quoteToken,
      baseToken
    );

    if (type === "base") {
      setBaseAmount("");
    }

    if (tokenFrom && tokenTo) {
      dispatch(setUserTokens({ tokenFrom, tokenTo }));
    }
    history.push({
      pathname: `${baseRoute}/${tokenFrom}/${tokenTo}`,
    });
  };

  let insufficientBalance: boolean = false;
  if (baseAmount && baseToken && Object.keys(balances.values).length) {
    if (parseFloat(baseAmount) === 0 || baseAmount === ".") {
      insufficientBalance = false;
    } else {
      const baseDecimals = baseTokenInfo?.decimals;
      if (baseDecimals) {
        insufficientBalance = new BigNumber(
          balances.values[baseToken!] || "0"
        ).lt(new BigNumber(baseAmount).multipliedBy(10 ** baseDecimals));
      }
    }
  }

  const handleAddActiveToken = (address: string) => {
    if (library) {
      dispatch(addActiveToken(address));
      dispatch(requestActiveTokenBalances({ provider: library! }));
      dispatch(requestActiveTokenAllowancesSwap({ provider: library! }));
      dispatch(requestActiveTokenAllowancesWrapper({ provider: library! }));
    }
  };

  const handleRemoveActiveToken = (address: string) => {
    if (library) {
      if (address === baseToken) {
        history.push({ pathname: `/${AppRoutes.swap}/-/${quoteToken || "-"}` });
        setBaseAmount(initialBaseAmount);
      } else if (address === quoteToken) {
        history.push({ pathname: `/${AppRoutes.swap}/${baseToken || "-"}/-` });
      }
      dispatch(removeActiveToken(address));
      dispatch(requestActiveTokenBalances({ provider: library! }));
      dispatch(requestActiveTokenAllowancesSwap({ provider: library! }));
      dispatch(requestActiveTokenAllowancesWrapper({ provider: library! }));
    }
  };

  const requestQuotes = async () => {
    if (swapType === "wrapOrUnwrap") {
      // This will re-render with a 1:1 price and a take button.
      setIsWrapping(true);
      return;
    }
    setIsRequestingQuotes(true);

    const usesWrapper = swapType === "swapWithWrap";
    const weth = wethAddresses[chainId!];
    const eth = nativeETH[chainId!];
    const _quoteToken = quoteToken === eth.address ? weth : quoteToken!;
    const _baseToken = baseToken === eth.address ? weth : baseToken!;

    let rfqServers, lastLookServers;
    try {
      try {
        const servers = await new Registry(
          chainId,
          // @ts-ignore provider type mismatch
          library
        ).getServers(_quoteToken, _baseToken, {
          initializeTimeout: 10 * 1000,
        });

        rfqServers = servers.filter((s) =>
          s.supportsProtocol("request-for-quote")
        );

        lastLookServers = servers.filter((s) =>
          s.supportsProtocol("last-look")
        );
      } catch (e) {
        console.error("Error requesting orders:", e);
        throw new Error("error requesting orders");
      }

      let rfqPromise: Promise<Order[]> | null = null,
        lastLookPromises: Promise<Pricing>[] | null = null;

      if (rfqServers.length) {
        let rfqDispatchResult = dispatch(
          request({
            servers: rfqServers,
            senderToken: _baseToken,
            senderAmount: baseAmount,
            signerToken: _quoteToken,
            senderTokenDecimals: baseTokenInfo!.decimals,
            senderWallet: usesWrapper ? Wrapper.getAddress(chainId) : account!,
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

      let orderPromises: Promise<Order[] | Pricing>[] = [];
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
  };

  const takeBestOption = async () => {
    let order: Order | null = null;
    try {
      setIsSwapping(true);
      // @ts-ignore
      // TODO: figure out type issues
      if (bestTradeOption!.protocol === "request-for-quote") {
        if (swapType !== "swapWithWrap") {
          const errors = ((await new Swap(chainId).check(
            bestTradeOption!.order!,
            // NOTE: once new swap contract is used, this (senderAddress) needs
            // to be the wrapper address for wrapped swaps.
            account!,
            library?.getSigner()
          ))) as ErrorType[];
          if (errors.length) {
            setValidatorErrors(errors);
            setIsSwapping(false);
            return;
          }
        }
        LastLook.unsubscribeAllServers();
        order = bestTradeOption!.order!;
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
      } else {
        // Setting quote amount prevents the UI from updating if pricing changes
        dispatch(setTradeTermsQuoteAmount(bestTradeOption!.quoteAmount));
        // Last look order.
        const {
          order: lastLookOrder,
          senderWallet,
        } = await LastLook.getSignedOrder({
          locator: bestTradeOption!.pricing!.locator,
          terms: { ...tradeTerms, quoteAmount: bestTradeOption!.quoteAmount },
        });
        order = lastLookOrder;
        const errors = ((await new Swap(chainId).check(
          order,
          senderWallet,
          library?.getSigner()
        ))) as ErrorType[];
        if (errors.length) {
          setValidatorErrors(errors);
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
      }
    } catch (e: any) {
      if (bestTradeOption!.protocol !== "request-for-quote") {
        setIsSwapping(false);
        dispatch(clearTradeTermsQuoteAmount());
      }

      if (e?.message.indexOf('User denied') === -1) {
        dispatch(
          revertTransaction({
            signerWallet: order?.signerWallet,
            nonce: order?.nonce,
            reason: e.message,
          })
        );
      }
      console.error("Error taking order:", e);
    }
  };

  const doWrap = async () => {
    const method = baseTokenInfo === nativeETH[chainId!] ? deposit : withdraw;
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
    } catch (e: any) {
      setIsSwapping(false);
      setIsWrapping(false);
    }
  };

  const handleButtonClick = async (action: ButtonActions) => {
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
        setValidatorErrors([]);
        dispatch(clearTradeTerms());
        dispatch(clear());
        unsubscribeFromGasPrice();
        unsubscribeFromTokenPrice();
        LastLook.unsubscribeAllServers();
        setBaseAmount(initialBaseAmount);
        break;

      case ButtonActions.reloadPage:
        window.location.reload();
        break;

      case ButtonActions.connectWallet:
        setShowWalletList(true);
        break;

      case ButtonActions.switchNetwork:
        try {
          (window as any).ethereum.request!({
            method: "wallet_switchEthereumChain",
            params: [
              {
                chainId: "0x1",
              },
            ],
          });
        } catch (e) {
          // unable to switch network, but doesn't matter too much as button
          // looks like a call to action in this case anyway.
        }
        break;

      case ButtonActions.requestQuotes:
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
        subscribeToGasPrice();
        subscribeToTokenPrice(
          quoteTokenInfo!,
          // @ts-ignore
          library!,
          chainId
        );
        await requestQuotes();

        break;

      case ButtonActions.approve:
        setIsApproving(true);
        await dispatch(
          approve({
            token: baseToken!,
            library,
            contractType: swapType === "swapWithWrap" ? "Wrapper" : "Swap",
            chainId: chainId!,
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
        onTrackTransactionClicked();
        break;

      default:
      // Do nothing.
    }
  };

  return (
    <>
      <StyledSwapWidget>
        <SwapWidgetHeader
          title={isApproving ? t("orders.approve") : t("common.swap")}
          isQuote={!isRequestingQuotes && !showOrderSubmitted}
          onGasFreeTradeButtonClick={() => setShowGasFeeInfo(true)}
          protocol={bestTradeOption?.protocol as ProtocolType}
          expiry={bestTradeOption?.order?.expiry}
        />
        {showOrderSubmitted ? (
          <HugeTicks />
        ) : isApproving || isSwapping ? (
          <></>
        ) : (
          <SwapInputs
            baseAmount={baseAmount}
            onBaseAmountChange={setBaseAmount}
            baseTokenInfo={baseTokenInfo}
            quoteTokenInfo={quoteTokenInfo}
            onChangeTokenClick={setShowTokenSelectModalFor}
            onMaxButtonClick={() => setBaseAmount(maxAmount || "0")}
            side="sell"
            tradeNotAllowed={pairUnavailable}
            isRequesting={isRequestingQuotes}
            // Note that using the quoteAmount from tradeTerms will stop this
            // updating when the user clicks the take button.
            quoteAmount={quoteAmount}
            disabled={!active || (!!quoteAmount && allowanceFetchFailed)}
            readOnly={
              !!bestTradeOption ||
              isWrapping ||
              isRequestingQuotes ||
              pairUnavailable ||
              !active
            }
            showMaxButton={!!maxAmount && baseAmount !== maxAmount}
          />
        )}
        <InfoContainer>
          <InfoSection
            orderSubmitted={showOrderSubmitted}
            isConnected={active}
            isPairUnavailable={pairUnavailable}
            isFetchingOrders={isRequestingQuotes}
            isApproving={isApproving}
            isSwapping={isSwapping}
            failedToFetchAllowances={allowanceFetchFailed}
            // @ts-ignore
            bestTradeOption={bestTradeOption}
            requiresApproval={
              bestRfqOrder && !hasSufficientAllowance(baseToken!)
            }
            baseTokenInfo={baseTokenInfo}
            baseAmount={baseAmount}
            quoteTokenInfo={quoteTokenInfo}
            isWrapping={isWrapping}
            onFeeButtonClick={() => setProtocolFeeDiscountInfo(true)}
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
              onButtonClicked={handleButtonClick}
              isLoading={
                isConnecting ||
                isRequestingQuotes ||
                ["approving", "taking"].includes(ordersStatus) ||
                (!!baseToken && hasApprovalPending(baseToken))
              }
              transactionsTabOpen={transactionsTabOpen}
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
          addActiveToken={handleAddActiveToken}
          removeActiveToken={handleRemoveActiveToken}
          chainId={chainId || 1}
        />
      </Overlay>

      <Overlay
        title={t("wallet.selectWallet")}
        onCloseButtonClick={() => setShowWalletList(false)}
        isHidden={!showWalletList}
      >
        <StyledWalletProviderList
          onClose={() => setShowWalletList(false)}
          onProviderSelected={(provider) => {
            dispatch(setActiveProvider(provider.name));
            setIsConnecting(true);
            activate(provider.getConnector()).finally(() =>
              setIsConnecting(false)
            );
          }}
        />
      </Overlay>
      <Overlay
        title={t("validatorErrors.unableSwap")}
        subTitle={t("validatorErrors.swapFail")}
        onCloseButtonClick={() => handleButtonClick(ButtonActions.restart)}
        isHidden={!validatorErrors.length}
      >
        <ErrorList
          errors={validatorErrors}
          handleClick={() => handleButtonClick(ButtonActions.restart)}
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
        title={t("information.protocolFeeDiscount.title")}
        onCloseButtonClick={() => setProtocolFeeDiscountInfo(false)}
        isHidden={!protocolFeeDiscountInfo}
      >
        <ProtocolFeeDiscountModal />
      </Overlay>

      <Overlay
        title={t("information.join.title")}
        onCloseButtonClick={onInformationModalCloseButtonClick}
        isHidden={activeInformationModal !== AppRoutes.join}
      >
        <JoinModal />
      </Overlay>
    </>
  );
};

export default SwapWidget;
