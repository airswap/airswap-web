import { toDecimalString } from "@airswap/utils";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import TokenSelect from "../../components/TokenSelect/TokenSelect";
import { selectAllowances } from "../balances/balancesSlice";
import { selectActiveTokens } from "../metadata/metadataSlice";
import {
  approve,
  request,
  selectOrder,
  selectOrdersStatus,
  take,
} from "./ordersSlice";

export function Orders() {
  const order = useAppSelector(selectOrder);
  const ordersStatus = useAppSelector(selectOrdersStatus);
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const allowances = useAppSelector(selectAllowances);
  const { senderToken, signerToken } = useParams<{
    senderToken: string;
    signerToken: string;
  }>();
  const history = useHistory();
  const [senderAmount, setSenderAmount] = useState("0.01");
  const { chainId, account, library, active } = useWeb3React<Web3Provider>();
  const { t } = useTranslation(["orders", "common"]);
  const { trackEvent } = useMatomo();

  let signerAmount = null;
  if (order) {
    signerAmount = toDecimalString(order.signerAmount, 6);
  }

  if (!active || !chainId) return null;

  // Determine whether the user has allowed spend of enough sender token to
  // take the order.
  const senderTokenInfo = activeTokens.find(
    (token) => token.address === senderToken
  );
  const signerTokenInfo = activeTokens.find(
    (token) => token.address === signerToken
  );
  const senderTokenHasAllowance = BigNumber.from(
    allowances.values[senderToken] || 0
  ).gte(parseUnits(senderAmount || "0", senderTokenInfo?.decimals || "ether"));

  let pageTitle: string | null = null;
  if (senderTokenInfo && signerTokenInfo) {
    pageTitle = t("orders:swapTokensPageTitle", {
      senderToken: senderTokenInfo.symbol,
      signerToken: signerTokenInfo.symbol,
    });
  } else if (senderTokenInfo) {
    pageTitle = t("orders:sellTokenPageTitle", {
      senderToken: senderTokenInfo.symbol,
    });
  } else if (signerTokenInfo) {
    pageTitle = t("orders:buyTokenPageTitle", {
      signerToken: signerTokenInfo.symbol,
    });
  }

  return (
    <Card className="flex-col m-4 w-72">
      {pageTitle && (
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
      )}
      <TokenSelect
        tokens={activeTokens}
        withAmount={true}
        amount={senderAmount}
        onAmountChange={(e) => setSenderAmount(e.currentTarget.value)}
        className="mb-2"
        label={t("orders:send")}
        token={senderToken}
        onTokenChange={(e) =>
          history.push(
            `/${e.currentTarget.value}/${
              !!signerToken && signerToken !== e.currentTarget.value
                ? signerToken
                : "-"
            }`
          )
        }
      />
      <TokenSelect
        tokens={activeTokens.filter((t) => t.address !== senderToken)}
        withAmount={false}
        className="mb-2"
        label="Receive"
        token={signerToken}
        onTokenChange={(e) =>
          history.push(`/${senderToken || "-"}/${e.currentTarget.value}`)
        }
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
          {senderTokenHasAllowance ? (
            <Button
              className="flex-1"
              aria-label={t("orders:take", { context: "aria" })}
              onClick={() => dispatch(take({ order, library }))}
            >
              {t("orders:take")}
            </Button>
          ) : (
            <Button
              className="flex-1"
              aria-label={t("orders:approve", { context: "aria" })}
              onClick={() => dispatch(approve({ token: senderToken, library }))}
            >
              {t("orders:approve")}
            </Button>
          )}
        </div>
      ) : (
        <span />
      )}
    </Card>
  );
}
