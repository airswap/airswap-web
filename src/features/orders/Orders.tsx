import React, { useState } from "react";
import { toDecimalString, getEtherscanURL } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { approve, request, take, selectOrder, selectTX } from "./ordersSlice";
import styles from "./Orders.module.css";

const tokens = {
  WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
};

const makers = [
  "aomcfsa7.altono.xyz",
  "airswap.aquanow.io",
  "ast.ngrok.io",
  "wintermute-rfq.com:44442",
];

export function Orders() {
  const order = useAppSelector(selectOrder);
  const tx = useAppSelector(selectTX);
  const dispatch = useAppDispatch();
  const [url, setURL] = useState(makers[1]);
  const [senderToken, setSenderToken] = useState(tokens.WETH);
  const [signerToken, setSignerToken] = useState(tokens.USDT);
  const [senderAmount, setSenderAmount] = useState("1");
  const { chainId, account, library, active } = useWeb3React<Web3Provider>();

  let signerAmount = null;
  if (order) {
    signerAmount = toDecimalString(order.signerAmount, 6);
  }

  if (!active) return null;

  return (
    <div>
      <div className={styles.row}>
        <label>Request from </label>
        <input
          className={styles.textbox}
          aria-label="Set URL"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className={styles.row}>
        <label>Token to send</label>
        <select
          value={senderToken}
          onChange={(e) => setSenderToken(e.target.value)}
        >
          <option value={tokens.WETH}>WETH</option>
          <option value={tokens.USDT}>USDT</option>
        </select>
      </div>
      <div className={styles.row}>
        <label>Amount to send</label>
        <input
          className={styles.textbox}
          aria-label="Set Amount"
          value={senderAmount}
          onChange={(e) => setSenderAmount(e.target.value)}
          placeholder="Amount..."
        />
      </div>
      <div className={styles.row}>
        <label>Token to receive</label>
        <select
          value={signerToken}
          onChange={(e) => setSignerToken(e.target.value)}
        >
          <option value={tokens.WETH}>WETH</option>
          <option value={tokens.USDT}>USDT</option>
        </select>
      </div>
      <div className={styles.row}>
        <button
          className={styles.asyncButton}
          onClick={() =>
            dispatch(
              request({
                url,
                chainId: `${chainId}`,
                senderToken,
                senderAmount,
                signerToken,
                senderWallet: account!,
              })
            )
          }
        >
          Request
        </button>
      </div>
      {signerAmount ? (
        <div>
          <div className={styles.row}>Amount to receive: {signerAmount}</div>
          <div className={styles.row}>
            <button
              className={styles.button}
              aria-label="Clear value"
              onClick={() => dispatch(approve({ token: senderToken, library }))}
            >
              Approve
            </button>
            <button
              className={styles.button}
              aria-label="Take swap"
              onClick={() => dispatch(take({ order, library }))}
            >
              Take
            </button>
          </div>
        </div>
      ) : (
        <span />
      )}
      <div className={styles.row}>
        {tx ? (
          <a
            target="_blank"
            rel="noreferrer"
            href={`${getEtherscanURL(`${chainId}`, tx)}`}
          >
            {tx}
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
