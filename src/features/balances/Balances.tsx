import { Fragment } from "react";
import { useWeb3React } from "@web3-react/core";
import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { requestBalances, selectBalances } from "./balancesSlice";
import classes from "./Balances.module.css";

// TODO: this is temporary.
const supportedTokens = [
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "0xc778417e063141139fce010982780140aa0cd5ab",
];

const Balances: FC<{}> = () => {
  const { active, chainId, library, account } = useWeb3React();
  const dispatch = useAppDispatch();
  const balances = useAppSelector(selectBalances);

  useEffect(() => {
    if (active && account) {
      dispatch(
        requestBalances({
          tokenAddresses: supportedTokens,
          chainId: `${chainId}` as "1" | "4" | "5" | "42",
          provider: library,
          walletAddress: account,
        })
      );
    }
  }, [active, account, chainId, dispatch, library]);

  return active ? (
    <div>
      <hr />
      <h4>Token Balances</h4>
      <div className={classes.balancesGrid}>
        {supportedTokens.map((tokenAddress) => {
          const tokenBalance = balances[tokenAddress];
          return (
            <Fragment key={`${tokenAddress}-balance`}>
              <span className={classes.token}>{tokenAddress}:</span>
              <span className={classes.balance}>
                {tokenBalance?.balanceStatus === "fetched"
                  ? tokenBalance?.balance.toString()
                  : tokenBalance?.balanceStatus || "unknown"}
              </span>
            </Fragment>
          );
        })}
      </div>
      <hr />
    </div>
  ) : null;
};

export default Balances;
