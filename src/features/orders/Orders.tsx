import { useState } from "react";
import { toDecimalString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  approve,
  request,
  take,
  selectOrder,
  selectOrdersStatus,
} from "./ordersSlice";
import {
  SubmittedApproval,
  selectTransactions,
} from "../transactions/transactionsSlice";
import { selectActiveTokens } from "../metadata/metadataSlice";
import { useTranslation } from "react-i18next";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import Card from "../../components/Card/Card";
import TokenSelect from "../../components/TokenSelect/TokenSelect";
import Button from "../../components/Button/Button";

export function Orders() {
  const order = useAppSelector(selectOrder);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const transactions = useAppSelector(selectTransactions);
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const [senderToken, setSenderToken] = useState<string>();
  const [signerToken, setSignerToken] = useState<string>();
  const [senderAmount, setSenderAmount] = useState("0.01");
  const { chainId, account, library, active } = useWeb3React<Web3Provider>();
  const { t } = useTranslation(["orders", "common"]);
  const { trackEvent } = useMatomo();

  let signerAmount = null;
  if (order) {
    signerAmount = toDecimalString(order.signerAmount, 6);
  }

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

  if (!active || !chainId) return null;

  return (
    <Card className="flex-col m-4 w-72">
      <TokenSelect
        tokens={activeTokens}
        withAmount={true}
        amount={senderAmount}
        onAmountChange={(e) => setSenderAmount(e.currentTarget.value)}
        className="mb-2"
        label={t("orders:send")}
        token={senderToken}
        onTokenChange={(e) => setSenderToken(e.currentTarget.value)}
      />
      <TokenSelect
        tokens={activeTokens}
        withAmount={false}
        className="mb-2"
        label="Receive"
        token={signerToken}
        onTokenChange={(e) => setSignerToken(e.currentTarget.value)}
      />
      <Button
        className="w-full mt-2"
        intent="primary"
        disabled={!senderToken || !signerToken || !senderAmount}
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
        {t("orders:request")}
      </Button>
      {signerAmount ? (
        <div>
          <div>Amount to receive: {signerAmount}</div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              aria-label={t("orders:approve", { context: "aria" })}
              loading={getTokenApprovalStatus(senderToken) === "processing"}
              onClick={() => dispatch(approve({ token: senderToken, library }))}
            >
              {t("orders:approve")}
            </Button>
            <Button
              className="flex-1"
              aria-label={t("orders:take", { context: "aria" })}
              onClick={() => dispatch(take({ order, library }))}
            >
              {t("orders:take")}
            </Button>
          </div>
        </div>
      ) : (
        <span />
      )}
    </Card>
  );
}
