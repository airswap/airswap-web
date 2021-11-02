import { useState, useMemo, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";

import { wethAddresses } from "@airswap/constants";
import { Registry, Wrapper } from "@airswap/libraries";
import { findTokensBySymbol } from "@airswap/metadata";
import { Pricing } from "@airswap/types";
import { LightOrder } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { unwrapResult } from "@reduxjs/toolkit";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  ADDITIONAL_QUOTE_BUFFER,
  RECEIVE_QUOTE_TIMEOUT_MS,
} from "../../constants/configParams";
import nativeETH from "../../constants/nativeETH";
import { LastLookContext } from "../../contexts/lastLook/LastLook";
import {
  requestActiveTokenAllowancesLight,
  requestActiveTokenAllowancesWrapper,
  requestActiveTokenBalances,
} from "../../features/balances/balancesSlice";
import {
  selectBalances,
  selectAllowances,
} from "../../features/balances/balancesSlice";
import {
  selectActiveTokens,
  selectAllTokenInfo,
  addActiveToken,
  removeActiveToken,
} from "../../features/metadata/metadataSlice";
import {
  approve,
  take,
  selectBestOrder,
  selectOrdersStatus,
  clear,
  selectBestOption,
  request,
  deposit,
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
import { selectPendingApprovals } from "../../features/transactions/transactionsSlice";
import { setActiveProvider } from "../../features/wallet/walletSlice";
import { Validator } from "../../helpers/Validator";
import findEthOrTokenByAddress from "../../helpers/findEthOrTokenByAddress";
import { AppRoutes } from "../../routes";
import type { Error } from "../ErrorList/ErrorList";
import { ErrorList } from "../ErrorList/ErrorList";
import Overlay from "../Overlay/Overlay";
import { notifyError } from "../Toasts/ToastController";
import TokenList from "../TokenList/TokenList";
import { Title } from "../Typography/Typography";
import InfoSection from "./InfoSection";
import StyledSwapWidget, {
  Header,
  InfoContainer,
  ButtonContainer,
  HugeTicks,
  StyledWalletProviderList,
} from "./SwapWidget.styles";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import SwapInputs from "./subcomponents/SwapInputs/SwapInputs";

type TokenSelectModalTypes = "base" | "quote" | null;
type SwapType = "swap" | "swapWithWrap" | "wrapOrUnwrap";

const initialBaseAmount = "";

const SwapWidget = () => {
  // Redux
  const dispatch = useAppDispatch();
  const history = useHistory();
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);
  const bestRfqOrder = useAppSelector(selectBestOrder);
  const rfqOrderStatus = useAppSelector(selectOrdersStatus);
  const bestTradeOption = useAppSelector(selectBestOption);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const supportedTokens = useAppSelector(selectAllSupportedTokens);
  const pendingApprovals = useAppSelector(selectPendingApprovals);
  const tradeTerms = useAppSelector(selectTradeTerms);

  // Contexts
  const LastLook = useContext(LastLookContext);

  // Input states
  let { tokenFrom, tokenTo } = useRouteMatch<AppRoutes>().params;
  const [baseAmount, setBaseAmount] = useState(initialBaseAmount);

  // Modals
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const [showOrderSubmitted, setShowOrderSubmitted] = useState<boolean>(false);
  const [
    showTokenSelectModalFor,
    setShowTokenSelectModalFor,
  ] = useState<TokenSelectModalTypes | null>(null);

  // Loading states
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isWrapping, setIsWrapping] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isRequestingQuotes, setIsRequestingQuotes] = useState<boolean>(false);

  // Error states
  const [pairUnavailable, setPairUnavailable] = useState<boolean>(false);
  const [validatorErrors, setValidatorErrors] = useState<Error[]>([]);

  const { t } = useTranslation([
    "orders",
    "common",
    "wallet",
    "balances",
    "toast",
    "validatorErrors",
  ]);

  const {
    chainId,
    account,
    library,
    active,
    activate,
  } = useWeb3React<Web3Provider>();

  let defaultBaseTokenAddress: string | null = allTokens.length
    ? findTokensBySymbol("USDT", allTokens)[0].address
    : null;
  let defaultQuoteTokenAddress: string | null = allTokens.length
    ? findTokensBySymbol("WETH", allTokens)[0].address
    : null;

  // Use default tokens only if neither are specified in the URL.
  const baseToken = tokenFrom
    ? tokenFrom
    : tokenTo
    ? null
    : defaultBaseTokenAddress;
  const quoteToken = tokenTo
    ? tokenTo
    : tokenFrom
    ? null
    : defaultQuoteTokenAddress;

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

  // Reset amount when the chainId changes.
  useEffect(() => {
    setBaseAmount(initialBaseAmount);
  }, [chainId]);

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

  const hasApprovalPending = (tokenId: string | undefined) => {
    if (tokenId === undefined) return false;
    return pendingApprovals.some((tx) => tx.tokenAddress === tokenId);
  };

  const hasSufficientAllowance = (tokenAddress: string | undefined) => {
    if (swapType === "wrapOrUnwrap") return true;
    if (!tokenAddress) return false;
    if (
      !allowances[swapType === "swapWithWrap" ? "wrapper" : "light"].values[
        tokenAddress
      ]
    )
      return false;
    return new BigNumber(
      allowances[swapType === "swapWithWrap" ? "wrapper" : "light"].values[
        tokenAddress
      ]!
    )
      .div(10 ** (baseTokenInfo?.decimals || 18))
      .gte(baseAmount);
  };

  const handleSetToken = (type: TokenSelectModalTypes, value: string) => {
    if (type === "base") {
      value === quoteToken
        ? history.push({ pathname: `/${value}/${baseToken}` })
        : history.push({ pathname: `/${value}/${quoteToken}` });
      setBaseAmount("");
    } else {
      value === baseToken
        ? history.push({ pathname: `/${quoteToken}/${value}` })
        : history.push({ pathname: `/${baseToken}/${value}` });
    }
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
      dispatch(requestActiveTokenAllowancesLight({ provider: library! }));
      dispatch(requestActiveTokenAllowancesWrapper({ provider: library! }));
    }
  };

  const handleRemoveActiveToken = (address: string) => {
    if (library) {
      if (address === baseToken) {
        history.push({ pathname: `/-/${quoteToken || "-"}` });
        setBaseAmount(initialBaseAmount);
      } else if (address === quoteToken) {
        history.push({ pathname: `/${baseToken || "-"}/-` });
      }
      dispatch(removeActiveToken(address));
      dispatch(requestActiveTokenBalances({ provider: library! }));
      dispatch(requestActiveTokenAllowancesLight({ provider: library! }));
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

      let rfqPromise: Promise<LightOrder[]> | null = null,
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

      let orderPromises: Promise<LightOrder[] | Pricing>[] = [];
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
            heading: t("orders:errorRequesting"),
            cta: t("orders:errorRequestingCta"),
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
    try {
      setIsSwapping(true);
      // @ts-ignore
      //TOOD figure out type issues
      const validator = new Validator(chainId, library?.getSigner());
      let errors;
      if (bestTradeOption!.protocol === "request-for-quote") {
        errors = errors = (await validator.checkSwap(
          bestTradeOption!.order!,
          account!
        )) as Error[];
        if (errors.length) {
          setValidatorErrors(errors);
          setIsSwapping(false);
          return;
        }
        LastLook.unsubscribeAllServers();
        const result = await dispatch(
          take({
            order: bestTradeOption!.order!,
            library,
            contractType: swapType === "swapWithWrap" ? "Wrapper" : "Light",
          })
        );
        setIsSwapping(false);
        await unwrapResult(result);
        setShowOrderSubmitted(true);
      } else {
        // Setting quote amount prevents the UI from updating if pricing changes
        dispatch(setTradeTermsQuoteAmount(bestTradeOption!.quoteAmount));
        // Last look order.
        const currOrder = await LastLook.getSignedOrder({
          locator: bestTradeOption!.pricing!.locator,
          terms: { ...tradeTerms, quoteAmount: bestTradeOption!.quoteAmount },
        });
        errors = (await validator.checkSwap(
          currOrder,
          // @ts-ignore FIXME: update types
          currOrder.senderWallet
        )) as Error[];
        if (errors.length) {
          setValidatorErrors(errors);
          setIsSwapping(false);
          return;
        }
        const accepted = await LastLook.sendOrderForConsideration({
          locator: bestTradeOption!.pricing!.locator,
          order: currOrder,
        });
        setIsSwapping(false);
        if (accepted) {
          setShowOrderSubmitted(true);
          LastLook.unsubscribeAllServers();
        } else {
          notifyError({
            heading: t("orders:swapRejected"),
            cta: t("orders:swapRejectedCallToAction"),
          });
        }
      }
    } catch (e: any) {
      if (bestTradeOption!.protocol !== "request-for-quote") {
        setIsSwapping(false);
        dispatch(clearTradeTermsQuoteAmount());
      }

      if (e.code && e.code === 4001) {
        // 4001 is metamask user declining transaction sig
      } else {
        // FIXME: notify user - toast?
      }
    }
  };

  const doWrap = async () => {
    const method = baseTokenInfo === nativeETH[chainId!] ? deposit : withdraw;
    setIsSwapping(true);
    const result = await dispatch(
      method({
        chainId: chainId!,
        senderAmount: baseAmount,
        senderTokenDecimals: baseTokenInfo!.decimals,
        provider: library,
      })
    );
    await unwrapResult(result);
    setIsSwapping(false);
    setIsWrapping(false);
    setShowOrderSubmitted(true);
  };

  const handleButtonClick = async (action: ButtonActions) => {
    switch (action) {
      case ButtonActions.goBack:
        setIsWrapping(false);
        setPairUnavailable(false);
        dispatch(clearTradeTerms());
        dispatch(clear());
        LastLook.unsubscribeAllServers();
        break;

      case ButtonActions.restart:
        setShowOrderSubmitted(false);
        dispatch(clearTradeTerms());
        dispatch(clear());
        LastLook.unsubscribeAllServers();
        setBaseAmount(initialBaseAmount);
        break;

      case ButtonActions.connectWallet:
        setShowWalletList(true);
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
        await requestQuotes();
        break;

      case ButtonActions.approve:
        setIsApproving(true);
        await dispatch(
          approve({
            token: baseToken!,
            library,
            contractType: swapType === "swapWithWrap" ? "Wrapper" : "Light",
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

      default:
      // Do nothing.
    }
  };

  return (
    <>
      <StyledSwapWidget>
        <Header>
          <Title type="h2">
            {isApproving ? t("orders:approve") : t("common:swap")}
          </Title>
        </Header>
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
            noFee={swapType === "wrapOrUnwrap"}
            // Note that using the quoteAmount from tradeTerms will stop this
            // updating when the user clicks the take button.
            quoteAmount={
              swapType === "wrapOrUnwrap"
                ? baseAmount
                : tradeTerms.quoteAmount || bestTradeOption?.quoteAmount || ""
            }
            readOnly={
              !!bestTradeOption ||
              isWrapping ||
              isRequestingQuotes ||
              pairUnavailable
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
            // @ts-ignore
            bestTradeOption={bestTradeOption}
            requiresApproval={
              bestRfqOrder && !hasSufficientAllowance(baseToken!)
            }
            baseTokenInfo={baseTokenInfo}
            baseAmount={baseAmount}
            quoteTokenInfo={quoteTokenInfo}
            isWrapping={isWrapping}
          />
        </InfoContainer>
        <ButtonContainer>
          {!isApproving && !isSwapping && (
            <ActionButtons
              walletIsActive={active}
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
                ["approving", "taking"].includes(rfqOrderStatus) ||
                (!!baseToken && hasApprovalPending(baseToken))
              }
            />
          )}
        </ButtonContainer>
      </StyledSwapWidget>

      <Overlay
        onClose={() => setShowTokenSelectModalFor(null)}
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
        title={t("wallet:selectWallet")}
        onClose={() => setShowWalletList(false)}
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
            setShowWalletList(false);
          }}
        />
      </Overlay>
      <Overlay
        title={t("validatorErrors:unableSwap")}
        subTitle={t("validatorErrors:swapFail")}
        onClose={async () => {
          await handleButtonClick(ButtonActions.restart);
          setValidatorErrors([]);
        }}
        isHidden={!validatorErrors.length}
      >
        <ErrorList
          errors={validatorErrors}
          handleClick={async () => {
            await handleButtonClick(ButtonActions.restart);
            setValidatorErrors([]);
          }}
        />
      </Overlay>
    </>
  );
};

export default SwapWidget;
