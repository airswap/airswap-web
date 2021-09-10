import { useState, FormEvent, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdArrowDownward, MdBlock } from "react-icons/md";
import { useHistory, useRouteMatch } from "react-router-dom";

import { findTokenByAddress } from "@airswap/metadata";
import { toDecimalString } from "@airswap/utils";
import { toAtomicString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { unwrapResult } from "@reduxjs/toolkit";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "ethers";
import { parseUnits, formatUnits } from "ethers/lib/utils";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import TokenSelection from "../../components/TokenSelection/TokenSelection";
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
} from "../../features/orders/ordersSlice";
import { selectAllSupportedTokens } from "../../features/registry/registrySlice";
import { selectPendingApprovals } from "../../features/transactions/transactionsSlice";
import { setActiveProvider } from "../../features/wallet/walletSlice";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import { AppRoutes } from "../../routes";
import Overlay from "../Overlay/Overlay";
import TokenSelect from "../TokenSelect/TokenSelect";
import InfoSection from "./InfoSection";
import StyledSwapWidget, {
  Header,
  InfoContainer,
  SubmitButton,
  BackButton,
  SwapIconContainer,
  ButtonContainer,
  HugeTicks,
  Placeholder,
  StyledWalletProviderList,
} from "./SwapWidget.styles";
import findTokenFromAndTokenToAddress from "./helpers/findTokenFromAndTokenToAddress";

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

type TokenSelectType = "senderToken" | "signerToken";

const SwapWidget = () => {
  const [senderToken, setSenderToken] = useState<string>();
  const [signerToken, setSignerToken] = useState<string>();
  const [senderAmount, setSenderAmount] = useState("0.01");
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const [showTokenSelection, setShowTokenSelection] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [pairUnavailable, setPairUnavailable] = useState<boolean>(false);
  const [showOrderSubmitted, setShowOrderSubmitted] = useState<boolean>(false);
  const [tokenSelectType, setTokenSelectType] = useState<TokenSelectType>(
    "senderToken"
  );

  const dispatch = useAppDispatch();
  const history = useHistory();
  const { tokenFrom, tokenTo } = useRouteMatch<AppRoutes>().params;
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);
  const order = useAppSelector(selectBestOrder);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const supportedTokens = useAppSelector(selectAllSupportedTokens);
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

  const senderTokenInfo = useMemo(
    () => (senderToken ? findTokenByAddress(senderToken, activeTokens) : null),
    [senderToken, activeTokens]
  );

  const signerTokenInfo = useMemo(
    () => (signerToken ? findTokenByAddress(signerToken, activeTokens) : null),
    [signerToken, activeTokens]
  );

  const pendingApprovals = useAppSelector(selectPendingApprovals);

  useEffect(() => {
    setSenderToken("");
    setSignerToken("");
    setSenderAmount("");
  }, [chainId]);

  useEffect(() => {
    if (allTokens.length) {
      const { fromAddress, toAddress } = findTokenFromAndTokenToAddress(
        allTokens,
        "USDT",
        "WETH",
        tokenFrom,
        tokenTo
      );

      setSenderToken(fromAddress);
      setSignerToken(toAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTokens.length]);

  const getTokenDecimals = (tokenAddress: string) => {
    for (const token of activeTokens) {
      if (token.address === tokenAddress) return token.decimals;
    }
    return null;
  };

  const hasApprovalPending = (tokenId: string | undefined) => {
    if (tokenId === undefined) return false;
    return pendingApprovals.some((tx) => tx.tokenAddress === tokenId);
  };

  const hasSufficientAllowance = (tokenAddress: string | undefined) => {
    if (!tokenAddress) return false;
    if (!allowances.values[tokenAddress]) return false;
    return allowances.values[tokenAddress]! >= senderAmount;
  };

  // function to only allow numerical and dot values to be inputted
  const handleTokenAmountChange = (e: FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    if (value === "" || floatRegExp.test(value)) {
      if (value[value.length - 1] === ",")
        value = value.slice(0, value.length - 1) + ".";
      setSenderAmount(value);
    }
  };

  const handleSetToken = (value: string, type: TokenSelectType) => {
    if (type === "senderToken") {
      history.push({ pathname: `/${value}/${signerToken}` });
      setSenderAmount("");
      setSenderToken(value);
    } else {
      history.push({ pathname: `/${senderToken}/${value}` });
      setSignerToken(value);
    }
  };

  const DisplayedButtons = () => {
    if (!active || !chainId) {
      return (
        <SubmitButton
          intent="primary"
          loading={isConnecting}
          onClick={() => setShowWalletList(true)}
        >
          {t("wallet:connectWallet")}
        </SubmitButton>
      );
    } else if (isApproving || isSwapping) {
      return <></>;
    } else if (pairUnavailable) {
      return (
        <>
          <BackButton
            onClick={() => {
              dispatch(clear());
              setPairUnavailable(false);
            }}
          >
            {t("common:back")}
          </BackButton>
        </>
      );
    } else if (showOrderSubmitted) {
      return (
        <SubmitButton
          intent="primary"
          onClick={() => {
            dispatch(clear());
            setShowOrderSubmitted(false);
          }}
        >
          {t("orders:newSwap")}
        </SubmitButton>
      );
    } else if (
      signerAmount &&
      hasSufficientAllowance(senderToken) &&
      signerToken &&
      senderToken
    ) {
      return (
        <>
          <BackButton
            onClick={() => {
              dispatch(clear());
            }}
          >
            {t("common:back")}
          </BackButton>
          <SubmitButton
            intent="primary"
            aria-label={t("orders:take", { context: "aria" })}
            disabled={isNaN(parseFloat(signerAmount))}
            loading={ordersStatus === "taking"}
            onClick={async () => {
              try {
                setIsSwapping(true);
                const result = await dispatch(take({ order, library }));
                setIsSwapping(false);
                await unwrapResult(result);
                setShowOrderSubmitted(true);
              } catch (e) {
                if (e.code && e.code === 4001) {
                  // 4001 is metamask user declining transaction sig, do nothing
                } else {
                  // FIXME: notify user - toast?
                }
              }
            }}
          >
            {t("orders:take")}
          </SubmitButton>
        </>
      );
    } else if (signerAmount && signerToken && senderToken) {
      return (
        <>
          <BackButton
            onClick={() => {
              dispatch(clear());
            }}
          >
            {t("common:back")}
          </BackButton>
          <SubmitButton
            intent="primary"
            aria-label={t("orders:approve", { context: "aria" })}
            loading={
              ordersStatus === "approving" || hasApprovalPending(senderToken)
            }
            onClick={async () => {
              setIsApproving(true);
              await dispatch(approve({ token: senderToken, library }));
              setIsApproving(false);
            }}
          >
            {t("orders:approve")}
          </SubmitButton>
        </>
      );
    } else {
      return (
        <SubmitButton
          intent="primary"
          disabled={
            !decimalsFound ||
            !senderToken ||
            !signerToken ||
            !senderAmount ||
            insufficientBalance ||
            parseFloat(senderAmount) === 0 ||
            senderAmount === "."
          }
          loading={ordersStatus === "requesting"}
          onClick={async () => {
            try {
              const result = await dispatch(
                request({
                  chainId: chainId!,
                  senderToken: senderToken!,
                  senderAmount,
                  senderTokenDecimals: senderTokenInfo!.decimals,
                  signerToken: signerToken!,
                  senderWallet: account!,
                  provider: library,
                })
              );
              const orders = await unwrapResult(result);
              if (!orders.length) throw new Error("no valid orders");
            } catch (e) {
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
          }}
        >
          {!insufficientBalance
            ? !senderAmount ||
              parseFloat(senderAmount) === 0 ||
              senderAmount === "."
              ? t("orders:enterAmount")
              : decimalsFound
              ? t("orders:continue")
              : t("orders:decimalsNotFound")
            : t("orders:insufficentBalance", {
                symbol: senderTokenInfo?.symbol,
              })}
        </SubmitButton>
      );
    }
  };

  let signerAmount: string | null = null;
  if (order) {
    const signerDecimals = getTokenDecimals(order.signerToken);
    if (signerDecimals) {
      signerAmount = toDecimalString(order.signerAmount, signerDecimals);
    } else {
      signerAmount = t("orders:decimalsNotFound");
    }
  }

  let parsedSenderAmount = null;
  let insufficientBalance: boolean = false;
  let decimalsFound: boolean = true;
  if (senderAmount && senderToken && Object.keys(balances.values).length) {
    if (parseFloat(senderAmount) === 0 || senderAmount === ".") {
      insufficientBalance = false;
    } else {
      const senderDecimals = getTokenDecimals(senderToken);
      if (senderDecimals) {
        parsedSenderAmount = parseUnits(senderAmount, senderDecimals);
        insufficientBalance = BigNumber.from(
          balances.values[senderToken!] || toAtomicString("0", 18)
        ).lt(parsedSenderAmount);
      } else decimalsFound = false;
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
      if (address === senderToken) {
        setSenderToken("");
        setSenderAmount("0.01");
      } else if (address === signerToken) setSignerToken("");
      dispatch(removeActiveToken(address));
      dispatch(requestActiveTokenBalances({ provider: library! }));
      dispatch(requestActiveTokenAllowances({ provider: library! }));
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
          <>
            <TokenSelect
              label={t("orders:from")}
              amount={senderAmount}
              onAmountChange={(e) => handleTokenAmountChange(e)}
              onChangeTokenClicked={() => {
                setTokenSelectType("senderToken");
                setShowTokenSelection(true);
              }}
              onMaxClicked={(e) => {
                if (senderToken) {
                  setSenderAmount(
                    formatUnits(
                      balances.values[senderToken] || "0",
                      senderTokenInfo?.decimals
                    )
                  );
                }
              }}
              readOnly={!!signerAmount || pairUnavailable}
              includeAmountInput={true}
              selectedToken={senderTokenInfo}
            />
            <SwapIconContainer>
              {pairUnavailable ? <MdBlock /> : <MdArrowDownward />}
            </SwapIconContainer>
            <TokenSelect
              label={t("orders:to")}
              amount={signerAmount && stringToSignificantDecimals(signerAmount)}
              onAmountChange={(e) => handleTokenAmountChange(e)}
              onChangeTokenClicked={() => {
                setTokenSelectType("signerToken");
                setShowTokenSelection(true);
              }}
              readOnly={!!signerAmount || pairUnavailable}
              includeAmountInput={!!signerAmount}
              amountDetails={
                !!signerAmount ? t("orders:afterFee", { fee: "0.07%" }) : ""
              }
              selectedToken={signerTokenInfo}
            />
          </>
        )}
        <InfoContainer>
          <InfoSection
            orderSubmitted={showOrderSubmitted}
            isConnected={active}
            isPairUnavailable={pairUnavailable}
            isFetchingOrders={ordersStatus === "requesting"}
            isApproving={isApproving}
            isSwapping={isSwapping}
            order={order}
            requiresApproval={order && !hasSufficientAllowance(senderToken)}
            senderTokenInfo={senderTokenInfo}
            signerTokenInfo={signerTokenInfo}
            timerExpiry={order ? parseInt(order.expiry) - 60 : null}
            onTimerComplete={() => {
              dispatch(
                request({
                  chainId: chainId!,
                  senderToken: senderToken!,
                  senderAmount,
                  senderTokenDecimals: senderTokenInfo!.decimals,
                  signerToken: signerToken!,
                  senderWallet: account!,
                  provider: library,
                })
              );
            }}
          />
        </InfoContainer>
        <ButtonContainer>
          <DisplayedButtons />
        </ButtonContainer>
      </StyledSwapWidget>

      <Overlay
        onClose={() => setShowTokenSelection(false)}
        isHidden={!showTokenSelection}
      >
        <TokenSelection
          signerToken={signerToken!}
          senderToken={senderToken!}
          setSignerToken={(value) => handleSetToken(value, "signerToken")}
          setSenderToken={(value) => handleSetToken(value, "senderToken")}
          tokenSelectType={tokenSelectType}
          balances={balances}
          allTokens={allTokens}
          activeTokens={activeTokens}
          supportedTokenAddresses={supportedTokens}
          addActiveToken={handleAddActiveToken}
          removeActiveToken={handleRemoveActiveToken}
          onClose={() => setShowTokenSelection(false)}
          chainId={chainId!}
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
