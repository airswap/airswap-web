import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";

import { findTokenByAddress } from "@airswap/metadata";
import { Web3Provider } from "@ethersproject/providers";
import { unwrapResult } from "@reduxjs/toolkit";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Title } from "../../components/Typography/Typography";
import {
  requestActiveTokenAllowances,
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
  request,
  take,
  selectBestOrder,
  selectOrdersStatus,
  clear,
  selectBestOption,
} from "../../features/orders/ordersSlice";
import { selectAllSupportedTokens } from "../../features/registry/registrySlice";
import {
  clearTradeTerms,
  setTradeTerms,
} from "../../features/tradeTerms/tradeTermsSlice";
import { selectPendingApprovals } from "../../features/transactions/transactionsSlice";
import { setActiveProvider } from "../../features/wallet/walletSlice";
import { AppRoutes } from "../../routes";
import Overlay from "../Overlay/Overlay";
import TokenList from "../TokenList/TokenList";
import InfoSection from "./InfoSection";
import StyledSwapWidget, {
  Header,
  InfoContainer,
  ButtonContainer,
  HugeTicks,
  Placeholder,
  StyledWalletProviderList,
} from "./SwapWidget.styles";
import findTokenFromAndTokenToAddress from "./helpers/findTokenFromAndTokenToAddress";
import ActionButtons, {
  ButtonActions,
} from "./subcomponents/ActionButtons/ActionButtons";
import SwapInputs from "./subcomponents/SwapInputs/SwapInputs";

type TokenSelectModalTypes = "base" | "quote" | null;

const initialBaseAmount = "0.01";

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

  // Input states
  const [baseToken, setBaseToken] = useState<string>();
  const [quoteToken, setQuoteToken] = useState<string>();
  const [baseAmount, setBaseAmount] = useState(initialBaseAmount);
  const { tokenFrom, tokenTo } = useRouteMatch<AppRoutes>().params;

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
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Error states
  const [pairUnavailable, setPairUnavailable] = useState<boolean>(false);

  const { t } = useTranslation([
    "orders",
    "common",
    "wallet",
    "balances",
    "toast",
  ]);

  const {
    chainId,
    account,
    library,
    active,
    activate,
  } = useWeb3React<Web3Provider>();

  const baseTokenInfo = useMemo(
    () => (baseToken ? findTokenByAddress(baseToken, activeTokens) : null),
    [baseToken, activeTokens]
  );

  const quoteTokenInfo = useMemo(
    () => (quoteToken ? findTokenByAddress(quoteToken, activeTokens) : null),
    [quoteToken, activeTokens]
  );

  // Reset everything when the chainId changes.
  useEffect(() => {
    setBaseToken("");
    setQuoteToken("");
    setBaseAmount(initialBaseAmount);
  }, [chainId]);

  // Default to USDT -> WETH
  useEffect(() => {
    if (allTokens.length) {
      const { fromAddress, toAddress } = findTokenFromAndTokenToAddress(
        allTokens,
        "USDT",
        "WETH",
        tokenFrom,
        tokenTo
      );
      setBaseToken(fromAddress);
      setQuoteToken(toAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTokens.length]);

  const hasApprovalPending = (tokenId: string | undefined) => {
    if (tokenId === undefined) return false;
    return pendingApprovals.some((tx) => tx.tokenAddress === tokenId);
  };

  const hasSufficientAllowance = (tokenAddress: string | undefined) => {
    if (!tokenAddress) return false;
    if (!allowances.values[tokenAddress]) return false;
    return new BigNumber(allowances.values[tokenAddress]!)
      .div(10 ** (baseTokenInfo?.decimals || 18))
      .gte(baseAmount);
  };

  const handleSetToken = (type: TokenSelectModalTypes, value: string) => {
    if (type === "base") {
      history.push({ pathname: `/${value}/${quoteToken}` });
      setBaseAmount("");
      setBaseToken(value);
    } else {
      history.push({ pathname: `/${baseToken}/${value}` });
      setQuoteToken(value);
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
      dispatch(requestActiveTokenAllowances({ provider: library! }));
    }
  };

  const handleRemoveActiveToken = (address: string) => {
    if (library) {
      if (address === baseToken) {
        setBaseToken("");
        setBaseAmount("0.01");
      } else if (address === quoteToken) setQuoteToken("");
      dispatch(removeActiveToken(address));
      dispatch(requestActiveTokenBalances({ provider: library! }));
      dispatch(requestActiveTokenAllowances({ provider: library! }));
    }
  };

  const requestQuotes = async () => {
    try {
      const result = await dispatch(
        request({
          chainId: chainId!,
          senderToken: baseToken!,
          senderAmount: baseAmount,
          senderTokenDecimals: baseTokenInfo!.decimals,
          signerToken: quoteToken!,
          senderWallet: account!,
          provider: library,
        })
      );
      const orders = await unwrapResult(result);
      if (!orders.length) throw new Error("no valid orders");
    } catch (e: any) {
      switch (e.message) {
        // may want to handle no peers differently in future.
        // case "no peers": {
        //   break;
        // }
        // case "no valid orders": {
        //   break;
        // }
        default: {
          setPairUnavailable(true);
        }
      }
    }
  };

  const setBaseAmountToMax = () => {
    if (baseToken && baseTokenInfo) {
      setBaseAmount(
        formatUnits(balances.values[baseToken] || "0", baseTokenInfo.decimals)
      );
    }
  };

  const takeBestOption = async () => {
    try {
      setIsSwapping(true);
      const result = await dispatch(
        take({ order: bestTradeOption!.order!, library })
      );
      setIsSwapping(false);
      await unwrapResult(result);
      setShowOrderSubmitted(true);
    } catch (e: any) {
      if (e.code && e.code === 4001) {
        // 4001 is metamask user declining transaction sig, do nothing
      } else {
        // FIXME: notify user - toast?
      }
    }
  };

  const handleButtonClick = async (action: ButtonActions) => {
    switch (action) {
      case ButtonActions.goBack:
        dispatch(clearTradeTerms());
        dispatch(clear());
        break;

      case ButtonActions.restart:
        setShowOrderSubmitted(false);
        dispatch(clearTradeTerms());
        dispatch(clear());
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
            baseTokenAmount: baseAmount,
            quoteToken: {
              address: quoteToken!,
              decimals: quoteTokenInfo!.decimals,
            },
            side: "sell",
          })
        );
        requestQuotes();
        break;

      case ButtonActions.approve:
        setIsApproving(true);
        await dispatch(approve({ token: baseToken, library }));
        setIsApproving(false);
        break;

      case ButtonActions.takeQuote:
        takeBestOption();
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
          <Placeholder />
        ) : (
          <SwapInputs
            baseAmount={baseAmount}
            onBaseAmountChange={setBaseAmount}
            baseTokenInfo={baseTokenInfo}
            quoteTokenInfo={quoteTokenInfo}
            onChangeTokenClick={setShowTokenSelectModalFor}
            onMaxButtonClick={setBaseAmountToMax}
            side="sell"
            tradeNotAllowed={pairUnavailable}
            isRequesting={rfqOrderStatus === "requesting"}
            quoteAmount={bestTradeOption?.quoteAmount || ""}
            readOnly={!!bestTradeOption}
          />
        )}
        <InfoContainer>
          <InfoSection
            orderSubmitted={showOrderSubmitted}
            isConnected={active}
            isPairUnavailable={pairUnavailable}
            isFetchingOrders={rfqOrderStatus === "requesting"}
            isApproving={isApproving}
            isSwapping={isSwapping}
            // @ts-ignore
            bestTradeOption={bestTradeOption}
            requiresApproval={
              bestRfqOrder && !hasSufficientAllowance(baseToken)
            }
            baseTokenInfo={baseTokenInfo}
            quoteTokenInfo={quoteTokenInfo}
            onTimerComplete={() => {
              dispatch(
                request({
                  chainId: chainId!,
                  senderToken: baseToken!,
                  senderAmount: baseAmount,
                  senderTokenDecimals: baseTokenInfo!.decimals,
                  signerToken: quoteToken!,
                  senderWallet: account!,
                  provider: library,
                })
              );
            }}
          />
        </InfoContainer>
        <ButtonContainer>
          {!isApproving && !isSwapping && (
            <ActionButtons
              walletIsActive={active}
              orderComplete={showOrderSubmitted}
              baseTokenInfo={baseTokenInfo}
              hasAmount={baseAmount !== "0" && baseAmount !== "."}
              hasQuote={!!bestTradeOption}
              hasSufficientBalance={!insufficientBalance}
              needsApproval={!hasSufficientAllowance(baseToken)}
              pairUnavailable={pairUnavailable}
              onButtonClicked={handleButtonClick}
              isLoading={
                isConnecting ||
                ["approving", "requesting", "taking"].includes(
                  rfqOrderStatus
                ) ||
                hasApprovalPending(baseToken)
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
    </>
  );
};

export default SwapWidget;
