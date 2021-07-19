import { useState, FormEvent, useEffect } from "react";
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
  selectBestOrder,
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
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
import TokenSelect from "../TokenSelect/TokenSelect";
import Timer from "../../components/Timer/Timer";
import Modal from "react-modal";
import Card from "../Card/Card";
import WalletProviderList from "../WalletProviderList/WalletProviderList";
import TokenSelection from "../../components/TokenSelection/TokenSelection";

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

const SwapWidget = () => {
  const [senderToken, setSenderToken] = useState<string>();
  const [signerToken, setSignerToken] = useState<string>();
  const [senderAmount, setSenderAmount] = useState("0.01");
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const [isRequestUpdated, setIsRequestUpdated] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
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
  const { chainId, account, library, active } = useWeb3React<Web3Provider>();
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
    if (order) setIsRequestUpdated(true);
  };

  const DisplayedButton = () => {
    if (!active || !chainId) {
      return (
        <Button
          className="w-full mt-2"
          intent="primary"
          onClick={() => setShowWalletList(true)}
        >
          {t("wallet:connectWallet")}
        </Button>
      );
    } else if (
      signerAmount &&
      !isRequestUpdated &&
      hasSufficientAllowance(senderToken) &&
      signerToken &&
      senderToken
    ) {
      return (
        <Button
          className="w-full mt-2"
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
        </Button>
      );
    } else if (
      signerAmount &&
      !isRequestUpdated &&
      signerToken &&
      senderToken
    ) {
      return (
        <Button
          className="w-full mt-2"
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
        </Button>
      );
    } else {
      return (
        <Button
          className="w-full mt-2"
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
                symbol: findTokenByAddress(senderToken!, activeTokens)?.symbol,
              })}
        </Button>
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
    setSenderAmount("0.01");
  }, [chainId]);

  return (
    <Card className="flex-col m-4 w-72">
      <Modal
        isOpen={tokenSelectModalOpen}
        onRequestClose={() => setTokenSelectModalOpen(false)}
        overlayClassName="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-10"
        className="w-120 p-6 rounded-sm bg-white dark:bg-gray-800 shadow-lg"
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
      {!order || isRequestUpdated ? (
        <h3 className="mb-4 font-bold">Swap now</h3>
      ) : (
        <p className="mb-4">
          Quote expires in&nbsp;
          <Timer
            expiryTime={parseInt(order.expiry)}
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
        </p>
      )}
      <TokenSelect
        tokens={activeTokens}
        withAmount={true}
        amount={senderAmount}
        onAmountChange={(e) => handleTokenAmountChange(e)}
        className="mb-2"
        label={t("orders:send")}
        token={senderToken}
        onSelectTokenClick={(e) => {
          setTokenSelectType("senderToken");
          setTokenSelectModalOpen(true);
          if (order) setIsRequestUpdated(true);
        }}
        hasError={insufficientBalance}
      />
      <TokenSelect
        tokens={activeTokens}
        withAmount={false}
        className="mb-2"
        label={t("orders:receive")}
        token={signerToken}
        quoteAmount={isRequestUpdated ? "" : signerAmount}
        onSelectTokenClick={(e) => {
          setTokenSelectType("signerToken");
          setTokenSelectModalOpen(true);
          if (order) setIsRequestUpdated(true);
        }}
      />
      <DisplayedButton />
      <Modal
        isOpen={showWalletList}
        onRequestClose={() => setShowWalletList(false)}
        overlayClassName="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-10"
        className="w-64 p-4 rounded-sm bg-white dark:bg-gray-800 shadow-lg"
      >
        {/* need to come back and fill out onProviderSelected */}
        <WalletProviderList onProviderSelected={() => null} />
      </Modal>
    </Card>
  );
};

export default SwapWidget;
