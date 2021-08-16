import { useState, FormEvent, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

import { findTokenByAddress } from "@airswap/metadata";
import { toDecimalString } from "@airswap/utils";
import { toAtomicString } from "@airswap/utils";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import TokenSelection from "../../components/TokenSelection/TokenSelection";
import {
  Title,
} from "../../components/Typography/Typography";
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
} from "../../features/orders/ordersSlice";
import {
  SubmittedApproval,
  selectTransactions,
} from "../../features/transactions/transactionsSlice";
import { setActiveProvider } from "../../features/wallet/walletSlice";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";
import TokenSelect from "../TokenSelect/TokenSelect2";
import WalletProviderList from "../WalletProviderList/WalletProviderList";
import InfoSection from "./InfoSection";
import StyledSwapWidget, {
  Header,
  QuoteAndTimer,
  InfoContainer,
  SubmitButton,
} from "./SwapWidget.styles";

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

const SwapWidget = () => {
  const [senderToken, setSenderToken] = useState<string>();
  const [signerToken, setSignerToken] = useState<string>();
  const [senderAmount, setSenderAmount] = useState("0.01");
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const [isRequestUpdated, setIsRequestUpdated] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
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
  const order = useAppSelector(selectBestOrder);
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

  const senderTokenInfo = useMemo(
    () => (senderToken ? findTokenByAddress(senderToken, activeTokens) : null),
    [senderToken, activeTokens]
  );
  const signerTokenInfo = useMemo(
    () => (signerToken ? findTokenByAddress(signerToken, activeTokens) : null),
    [signerToken, activeTokens]
  );

  console.log(
    { senderToken },
    activeTokens.find((t) => t.address === senderToken)
  );

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
    if (order) setIsRequestUpdated(true);
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
    } else if (
      signerAmount &&
      !isRequestUpdated &&
      hasSufficientAllowance(senderToken) &&
      signerToken &&
      senderToken
    ) {
      return (
        <SubmitButton
          intent="primary"
          aria-label={t("orders:take", { context: "aria" })}
          disabled={isNaN(parseFloat(signerAmount))}
          loading={ordersStatus === "taking"}
          onClick={async () => {
            dispatch(take({ order, library }));
            setIsRequestUpdated(false);
          }}
        >
          {t("orders:take")}
        </SubmitButton>
      );
    } else if (
      signerAmount &&
      !isRequestUpdated &&
      signerToken &&
      senderToken
    ) {
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
            setIsRequestUpdated(false);
          }}
        >
          {!insufficientBalance
            ? !senderAmount || parseFloat(senderAmount) === 0
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
    setSenderAmount("");
  }, [chainId]);

  return (
    <>
      <StyledSwapWidget>
        <Header>
          <Title type="h2">Swap</Title>
        </Header>
        <TokenSelect
          label={t("orders:from")}
          amount={senderAmount}
          onAmountChange={(e) => handleTokenAmountChange(e)}
          onChangeTokenClicked={() => {
            setTokenSelectType("senderToken");
            setTokenSelectModalOpen(true);
            if (order) setIsRequestUpdated(true);
          }}
          readOnly={!!signerAmount}
          includeAmountInput={true}
          selectedToken={senderTokenInfo}
        />
        <TokenSelect
          label={t("orders:to")}
          amount={signerAmount && stringToSignificantDecimals(signerAmount)}
          onAmountChange={(e) => handleTokenAmountChange(e)}
          onChangeTokenClicked={() => {
            setTokenSelectType("signerToken");
            setTokenSelectModalOpen(true);
            if (order) setIsRequestUpdated(true);
          }}
          readOnly={!!signerAmount}
          includeAmountInput={!!signerAmount}
          amountDetails={!!signerAmount ? "After 0.3% fee" : ""}
          selectedToken={signerTokenInfo}
        />
        <InfoContainer>
          <InfoSection
            isConnected={active}
            isFetchingOrders={ordersStatus === "requesting"}
            order={order}
            requiresApproval={order && !hasSufficientAllowance(senderToken)}
            senderTokenInfo={senderTokenInfo}
            signerTokenInfo={signerTokenInfo}
          />
        </InfoContainer>
        <DisplayedButton />
      </StyledSwapWidget>

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
