import { useState, FormEvent } from "react";
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
import { selectActiveTokens } from "../../features/metadata/metadataSlice";
import { selectBalances } from "../../features/balances/balancesSlice";
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

const floatRegExp = new RegExp("^[+-]?([0-9]+([.|,][0-9]*)?|[.][0-9]+)$");

const SwapWidget = () => {
  const [senderToken, setSenderToken] = useState<string>();
  const [signerToken, setSignerToken] = useState<string>();
  const [senderAmount, setSenderAmount] = useState("0.01");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const transactions = useAppSelector(selectTransactions);
  const balances = useAppSelector(selectBalances);
  const order = useAppSelector(selectBestOrder);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const { t } = useTranslation(["orders", "common", "wallet"]);
  const { chainId, account, library, active } = useWeb3React<Web3Provider>();
  const { trackEvent } = useMatomo();

  const getTokenDecimals = (tokenAddress: string) => {
    for (const token of activeTokens) {
      if (token.address === tokenAddress) return token.decimals;
    }
    return 18;
  };

  const getTokenApprovalStatus = (tokenId: string | undefined) => {
    if (tokenId === undefined) return null;
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].type === "Approval") {
        const approvalTx: SubmittedApproval = transactions[
          i
        ] as SubmittedApproval;
        if (approvalTx.tokenAddress === tokenId) return approvalTx.status;
      }
    }
    return null;
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
        <Button
          className="w-full mt-2"
          intent="primary"
          loading={isConnecting}
          onClick={() => setShowWalletList(true)}
        >
          {t("wallet:connectWallet")}
        </Button>
      );
    } else if (
      signerAmount &&
      // change this to a balance check
      getTokenApprovalStatus(senderToken) === "succeeded" &&
      signerToken &&
      senderToken
    ) {
      return (
        <Button
          className="w-full mt-2"
          intent="primary"
          aria-label={t("orders:take", { context: "aria" })}
          loading={ordersStatus === "taking"}
          onClick={async () => dispatch(take({ order, library }))}
        >
          {t("orders:take")}
        </Button>
      );
    } else if (signerAmount && signerToken && senderToken) {
      return (
        <Button
          className="w-full mt-2"
          intent="primary"
          aria-label={t("orders:approve", { context: "aria" })}
          loading={getTokenApprovalStatus(senderToken) === "processing"}
          onClick={() => dispatch(approve({ token: senderToken, library }))}
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
            !senderToken ||
            !signerToken ||
            !senderAmount ||
            insufficientBalance ||
            parseFloat(senderAmount) === 0
          }
          loading={ordersStatus === "requesting"}
          onClick={() => {
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
        >
          {!insufficientBalance
            ? !senderAmount || parseFloat(senderAmount) === 0
              ? t("orders:enterAmount")
              : t("orders:continue")
            : t("orders:insufficentBalance", {
                symbol: findTokenByAddress(senderToken!, activeTokens)?.symbol,
              })}
        </Button>
      );
    }
  };

  let signerAmount: string | null = null;
  if (order) {
    signerAmount = toDecimalString(
      order.signerAmount,
      getTokenDecimals(order.signerToken)
    );
  }

  let parsedSenderAmount = null;
  let insufficientBalance: boolean = false;
  if (senderAmount && senderToken && Object.keys(balances.values).length) {
    if (parseFloat(senderAmount) === 0) {
      insufficientBalance = false;
    } else {
      const decimals = getTokenDecimals(senderToken);
      parsedSenderAmount = parseUnits(senderAmount, decimals);
      insufficientBalance = BigNumber.from(
        balances.values[senderToken!] || toAtomicString("0", 18)
      ).lt(parsedSenderAmount);
    }
  }

  return (
    <Card className="flex-col m-4 w-72">
      {!order ? (
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
        onTokenChange={(e) => setSenderToken(e.currentTarget.value)}
        hasError={insufficientBalance}
      />
      <TokenSelect
        tokens={activeTokens}
        withAmount={false}
        className="mb-2"
        label={t("orders:receive")}
        token={signerToken}
        quoteAmount={signerAmount}
        onTokenChange={(e) => setSignerToken(e.currentTarget.value)}
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
