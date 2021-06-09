import React, { useState } from "react";
import { toDecimalString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { approve, request, take, selectOrder } from "./ordersSlice";
import styles from "./Orders.module.css";
import { selectActiveTokens } from "../metadata/metadataSlice";
import { useTranslation } from "react-i18next";

export function Orders() {
  const order = useAppSelector(selectOrder);
  const dispatch = useAppDispatch();
  const activeTokens = useAppSelector(selectActiveTokens);
  const [senderToken, setSenderToken] = useState<string>();
  const [signerToken, setSignerToken] = useState<string>();
  const [senderAmount, setSenderAmount] = useState("0.01");
  const { chainId, account, library, active } = useWeb3React<Web3Provider>();
  const { t } = useTranslation(["orders", "common"]);

  let signerAmount = null;
  if (order) {
    signerAmount = toDecimalString(order.signerAmount, 6);
  }

  if (!active || !chainId) return null;

  return (
    <div>
      <div className={styles.row}>
        <label>{t("orders:tokenToSend")}</label>
        <select
          value={senderToken}
          onChange={(e) => setSenderToken(e.target.value)}
        >
          <option>{t("common:select")}...</option>
          {activeTokens.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.row}>
        <label>{t("orders:sendAmount")}</label>
        <input
          className={styles.textbox}
          aria-label={t("orders:sendAmount", { context: "aria" })}
          value={senderAmount}
          onChange={(e) => setSenderAmount(e.target.value)}
          placeholder={`${t("orders:amount")}...`}
        />
      </div>
      <div className={styles.row}>
        <label>{t("orders:tokenToRecieve")}</label>
        <select
          value={signerToken}
          onChange={(e) => setSignerToken(e.target.value)}
        >
          <option>{t("common:select")}...</option>
          {activeTokens
            .filter((token) => token.address !== senderToken)
            .map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
        </select>
      </div>
      <div className={styles.row}>
        <button
          disabled={!senderToken || !signerToken || !senderAmount}
          className={styles.asyncButton}
          onClick={() =>
            dispatch(
              request({
                chainId: chainId!,
                senderToken: senderToken!,
                senderAmount,
                signerToken: signerToken!,
                senderWallet: account!,
                provider: library,
              })
            )
          }
        >
          {t("orders:request")}
        </button>
      </div>
      {signerAmount ? (
        <div>
          <div className={styles.row}>Amount to receive: {signerAmount}</div>
          <div className={styles.row}>
            <button
              className={styles.button}
              aria-label={t("orders:approve", { context: "aria" })}
              onClick={() => dispatch(approve({ token: senderToken, library }))}
            >
              {t("orders:approve")}
            </button>
            <button
              className={styles.button}
              aria-label={t("orders:take", { context: "aria" })}
              onClick={() => dispatch(take({ order, library }))}
            >
              {t("orders:take")}
            </button>
          </div>
        </div>
      ) : (
        <span />
      )}
    </div>
  );
}
