import { FormEvent, useState } from "react";
import { toDecimalString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  approve,
  request,
  take,
  selectBestOrder,
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
import Timer from "../../components/Timer/Timer";
import Button from "../../components/Button/Button";
import { toAtomicString } from "@airswap/utils";
import { selectBalances } from "../balances/balancesSlice";
import { BigNumber } from "ethers";
import { findTokenByAddress } from "@airswap/metadata";
import { parseUnits } from "ethers/lib/utils";

const floatRegExp = new RegExp("^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

export function Orders() {
  const order = useAppSelector(selectBestOrder);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const transactions = useAppSelector(selectTransactions);
  const balances = useAppSelector(selectBalances);
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const [senderToken, setSenderToken] = useState<string>();
  const [signerToken, setSignerToken] = useState<string>();
  const [senderAmount, setSenderAmount] = useState<string>("0.0");
  const { chainId, account, library, active } = useWeb3React<Web3Provider>();
  const { t } = useTranslation(["orders", "common"]);
  const { trackEvent } = useMatomo();

  let signerAmount = null;
  if (order) {
    signerAmount = toDecimalString(order.signerAmount, 6);
  }

  const getTokenDecimals = (tokenAddress: string) => {
    activeTokens.forEach((token) => {
      if (token.address === tokenAddress) return token.decimals;
    });
    return 18;
  };

  let parsedSenderAmount = null;
  let insuffcientBalance: boolean = false;
  if (senderAmount && senderToken && balances) {
    if (parseFloat(senderAmount) === 0) {
      insuffcientBalance = false;
    } else {
      const decimals = getTokenDecimals(senderToken);
      parsedSenderAmount = parseUnits(senderAmount, decimals);
      insuffcientBalance = BigNumber.from(
        balances.values[senderToken!] || toAtomicString("0", 18)
      ).lt(parsedSenderAmount);
    }
  }

  // function to only allow numerical and dot values to be inputted
  const handleTokenAmountChange = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value === "" || floatRegExp.test(value)) {
      setSenderAmount(value);
    }
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

  if (!active || !chainId) return null;

  return (
    <Card className="flex-col m-4 w-72">
      <TokenSelect
        tokens={activeTokens}
        withAmount={true}
        amount={senderAmount}
        onAmountChange={(e) => handleTokenAmountChange(e)}
        className="mb-2"
        label={t("orders:send")}
        token={senderToken}
        onTokenChange={(e) => setSenderToken(e.currentTarget.value)}
        hasError={insuffcientBalance}
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
        disabled={
          !senderToken ||
          !signerToken ||
          !senderAmount ||
          insuffcientBalance ||
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
        {!insuffcientBalance
          ? !senderAmount || parseFloat(senderAmount) === 0
            ? t("orders:enterAmount")
            : t("orders:request")
          : t("orders:insufficentBalance", {
              symbol: findTokenByAddress(senderToken!, activeTokens).symbol,
            })}
      </Button>
      {signerAmount ? (
        <div>
          {order ? (
            <>
              <div>Amount to receive: {signerAmount}</div>
              <p>
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
            </>
          ) : null}
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
              loading={ordersStatus === "taking"}
              onClick={async () => dispatch(take({ order, library }))}
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
