import { useState, FormEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { MdKeyboardBackspace } from "react-icons/md";
import { toDecimalString } from "@airswap/utils";
import { toAtomicString } from "@airswap/utils";
import { BigNumber } from "ethers";
import { findTokenByAddress } from "@airswap/metadata";
import { parseUnits } from "ethers/lib/utils";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  SubmittedApproval,
  selectTransactions,
} from "../../features/transactions/transactionsSlice";
import {
  approve,
  request,
  take,
  selectSortedOrders,
  selectOrdersStatus,
} from "../../features/orders/ordersSlice";
import {
  selectActiveTokens,
  selectAllTokenInfo,
  addActiveToken,
  removeActiveToken,
} from "../../features/metadata/metadataSlice";
import {
  requestActiveTokenAllowances,
  requestActiveTokenBalances,
} from "../../features/balances/balancesSlice";
import {
  selectBalances,
  selectAllowances,
} from "../../features/balances/balancesSlice";
import { setActiveProvider } from "../../features/wallet/walletSlice";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Timer from "../../components/Timer/Timer";
import { Title, Subtitle } from "../../components/Typography/Typography";
import WalletProviderList from "../WalletProviderList/WalletProviderList";
import TokenSelection from "../../components/TokenSelection/TokenSelection";
import FeaturedQuote from "../../components/FeaturedQuote/FeaturedQuote";
import {
  StyledContainer,
  Header,
  QuoteAndTimer,
  StyledTokenSelect,
  SubmitButton,
  TimerContainer,
  StyledViewAllLink,
  TitleAndBackButtonContainer,
} from "./SwapWidget.styles";
import QuoteComparison from "../QuoteComparison/QuoteComparison";

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

const SwapWidget = () => {
  const [senderToken, setSenderToken] = useState<string>();
  const [signerToken, setSignerToken] = useState<string>();
  const [senderAmount, setSenderAmount] = useState("0.01");
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showQuoteComparison, setShowQuoteComparison] = useState<boolean>(
    false
  );

  const [tokenSelectModalOpen, setTokenSelectModalOpen] = useState<boolean>(
    false
  );
  const [tokenSelectType, setTokenSelectType] = useState<
    "senderToken" | "signerToken"
  >("senderToken");
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactions);
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);
  const sortedOrders = useAppSelector(selectSortedOrders);
  const bestOrder = sortedOrders[0];
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const activeTokens = useAppSelector(selectActiveTokens);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const { t } = useTranslation(["orders", "common", "wallet"]);
  const {
    chainId,
    account,
    library,
    active,
    activate,
  } = useWeb3React<Web3Provider>();
  const { trackEvent } = useMatomo();

  const getTokenDecimals = (tokenAddress: string) => {
    for (const token of activeTokens) {
      if (token.address === tokenAddress) return token.decimals;
    }
    return null;
  };

  const getTokenApprovalStatus = (tokenId: string | undefined) => {
    if (tokenId === undefined) return null;
    for (let i = transactions.length - 1; i >= 0; i--) {
      if (transactions[i].type === "Approval") {
        const approvalTx: SubmittedApproval = transactions[
          i
        ] as SubmittedApproval;
        if (approvalTx.tokenAddress === tokenId) return approvalTx.status;
      }
    }
    return null;
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

  const DisplayedButton = () => {
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
    } else if (bestOrder && hasSufficientAllowance(senderToken)) {
      return (
        <SubmitButton
          intent="primary"
          aria-label={t("orders:take", { context: "aria" })}
          disabled={isNaN(parseFloat(signerAmount!))}
          loading={ordersStatus === "taking"}
          onClick={async () => {
            dispatch(take({ order: bestOrder, library }));
          }}
        >
          {t("orders:take")}
        </SubmitButton>
      );
    } else if (bestOrder) {
      return (
        <SubmitButton
          intent="primary"
          aria-label={t("orders:approve", { context: "aria" })}
          loading={
            getTokenApprovalStatus(senderToken) === "processing" || isApproving
          }
          onClick={async () => {
            setIsApproving(true);
            await dispatch(approve({ token: senderToken, library }));
            setIsApproving(false);
          }}
        >
          {t("orders:approve")}
        </SubmitButton>
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
            parseFloat(senderAmount) === 0
          }
          loading={ordersStatus === "requesting"}
          onClick={async () => {
            await dispatch(
              request({
                chainId: chainId!,
                senderToken: senderToken!,
                senderAmount,
                signerToken: signerToken!,
                senderWallet: account!,
                provider: library,
              })
            );
            trackEvent({ category: "order", action: "request" });
          }}
        >
          {!insufficientBalance
            ? !senderAmount || parseFloat(senderAmount) === 0
              ? t("orders:enterAmount")
              : decimalsFound
              ? t("orders:continue")
              : t("orders:decimalsNotFound")
            : t("orders:insufficentBalance", {
                symbol: findTokenByAddress(senderToken!, activeTokens)?.symbol,
              })}
        </SubmitButton>
      );
    }
  };

  let signerAmount: string | null = null;
  if (bestOrder) {
    const signerDecimals = getTokenDecimals(bestOrder.signerToken);
    if (signerDecimals) {
      signerAmount = toDecimalString(bestOrder.signerAmount, signerDecimals);
    } else {
      signerAmount = t("orders:decimalsNotFound");
    }
  }

  let parsedSenderAmount = null;
  let insufficientBalance: boolean = false;
  let decimalsFound: boolean = true;
  if (senderAmount && senderToken && Object.keys(balances.values).length) {
    if (parseFloat(senderAmount) === 0) {
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
  insufficientBalance = false;

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

  useEffect(() => {
    setSenderToken("");
    setSignerToken("");
    setSenderAmount("0.01");
  }, [chainId]);

  return (
    <>
      <StyledContainer>
        {!bestOrder ? (
          <>
            <Header>
              <Title type="h4">Swap now</Title>
            </Header>
            <StyledTokenSelect
              tokens={activeTokens}
              withAmount={true}
              amount={senderAmount}
              onAmountChange={(e) => handleTokenAmountChange(e)}
              label={t("orders:send")}
              token={senderToken}
              onTokenChange={() => {
                setTokenSelectType("senderToken");
                setTokenSelectModalOpen(true);
              }}
              hasError={insufficientBalance}
            />
            <StyledTokenSelect
              tokens={activeTokens}
              withAmount={false}
              label={t("orders:receive")}
              token={signerToken}
              onTokenChange={() => {
                setTokenSelectType("signerToken");
                setTokenSelectModalOpen(true);
              }}
            />
            <DisplayedButton />
          </>
        ) : !showQuoteComparison ? (
          <>
            <Header>
              <QuoteAndTimer>
                <Title type="h4">{t("orders:bestQuote")}</Title>
                <TimerContainer>
                  <Subtitle>New quotes in&nbsp;</Subtitle>
                  <Timer
                    expiryTime={parseInt(bestOrder.expiry)}
                    onTimerComplete={() => {
                      dispatch(
                        request({
                          chainId: chainId!,
                          senderToken: senderToken!,
                          senderAmount,
                          signerToken: signerToken!,
                          senderWallet: account!,
                          provider: library,
                        })
                      );
                      trackEvent({ category: "order", action: "request" });
                    }}
                  />
                </TimerContainer>
              </QuoteAndTimer>
            </Header>
            <FeaturedQuote
              quote={bestOrder}
              senderTokenInfo={findTokenByAddress(
                bestOrder.senderToken!,
                activeTokens
              )}
              signerTokenInfo={findTokenByAddress(
                bestOrder.signerToken!,
                activeTokens
              )}
            />
            <StyledViewAllLink
              as="button"
              onClick={() => setShowQuoteComparison(true)}
            >
              View {sortedOrders.length} received quotes
            </StyledViewAllLink>
            <DisplayedButton />
          </>
        ) : (
          <>
            <Header>
              <TitleAndBackButtonContainer>
                <button onClick={() => setShowQuoteComparison(false)}>
                  <MdKeyboardBackspace />
                </button>
                <Title type="h4">
                  {t("orders:receivedQuotes")} ({sortedOrders.length})
                </Title>
              </TitleAndBackButtonContainer>
            </Header>
            <QuoteComparison
              quotes={sortedOrders}
              signerTokenInfo={findTokenByAddress(
                bestOrder.signerToken!,
                activeTokens
              )}
            />
          </>
        )}
      </StyledContainer>
      <Modal
        isOpen={showWalletList}
        onRequestClose={() => setShowWalletList(false)}
        className="modal"
        overlayClassName="overlay"
      >
        {/* need to come back and fill out onProviderSelected */}
        <WalletProviderList
          onProviderSelected={(provider) => {
            dispatch(setActiveProvider(provider.name));
            setIsConnecting(true);
            activate(provider.getConnector()).finally(() =>
              setIsConnecting(false)
            );
            setShowWalletList(false);
          }}
        />
      </Modal>
      <Modal
        isOpen={tokenSelectModalOpen}
        onRequestClose={() => setTokenSelectModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <TokenSelection
          closeModal={() => setTokenSelectModalOpen(false)}
          signerToken={signerToken!}
          senderToken={senderToken!}
          setSignerToken={setSignerToken}
          setSenderToken={setSenderToken}
          tokenSelectType={tokenSelectType}
          balances={balances}
          allTokens={allTokens}
          activeTokens={activeTokens}
          addActiveToken={handleAddActiveToken}
          removeActiveToken={handleRemoveActiveToken}
          chainId={chainId!}
        />
      </Modal>
    </>
  );
};

export default SwapWidget;
