import React, { useState } from "react";
import { toDecimalString, getEtherscanURL } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { approve, request, take, selectOrder, selectTX } from "./ordersSlice";
import styles from "./Orders.module.css";

const tokens = {
  WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
  DAI: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
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
  const [senderToken, setSenderToken] = useState(tokens.WETH);
  const [signerToken, setSignerToken] = useState(tokens.DAI);
  const [senderAmount, setSenderAmount] = useState("0.1");
  const { chainId, account, library, active } = useWeb3React<Web3Provider>();

  let signerAmount = null;
  if (order) {
    signerAmount = toDecimalString(order.signerAmount, 6);
  }

  if (!active) return null;

  return (
    <div>
      <div className={styles.row}>
        <label>Token to send</label>
        <select
          value={senderToken}
          onChange={(e) => setSenderToken(e.target.value)}
        >
          <option value={tokens.WETH}>WETH</option>
          <option value={tokens.DAI}>DAI</option>
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
          <option value={tokens.DAI}>DAI</option>
        </select>
      </div>
      <div className={styles.row}>
        <button
          className={styles.asyncButton}
          onClick={() =>
            dispatch(
              request({
                chainId: chainId!,
                senderToken,
                senderAmount,
                signerToken,
                senderWallet: account!,
                provider: library,
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
