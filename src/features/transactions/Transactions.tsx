import React from "react";
import { getEtherscanURL } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "../../app/hooks";
import { selectTransactions } from "./transactionsSlice";

export function Transactions() {
  const transactions = useAppSelector(selectTransactions);
  const { active, chainId } = useWeb3React<Web3Provider>();

  if (!active || !chainId) return null;

  const icons = {
    succeeded: "✅",
    reverted: "🚫",
    processing: "⏳",
  };

  return (
    <div>
      {transactions.map((submittedOrder) => (
        <div key={submittedOrder.hash}>
          {icons[submittedOrder.status]}:
          <a
            target="_blank"
            rel="noreferrer"
            href={`${getEtherscanURL(`${chainId}`, submittedOrder.hash!)}`}
          >
            {submittedOrder.hash}
          </a>
        </div>
      ))}
    </div>
  );
}
