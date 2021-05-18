import { Fragment } from "react";
import { useWeb3React } from "@web3-react/core";
import { FC } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectBalances } from "./balancesSlice";
import classes from "./Balances.module.css";
import useTokenSetInfo from "../../hooks/useTokenSetInfo";

const Balances: FC<{}> = () => {
  const { active, chainId } = useWeb3React();
  const tokenSetInfo = useTokenSetInfo(chainId);
  const balances = useAppSelector(selectBalances);

  return active ? (
    <div>
      <hr />
      <h4>Token Balances</h4>
      <div className={classes.balancesGrid}>
        {tokenSetInfo.map((tokenInfo) => {
          const tokenBalance = balances.values[tokenInfo.address];
          return (
            <Fragment key={`${tokenInfo.address}-balance`}>
              <span className={classes.token}>{tokenInfo.symbol}:</span>
              <span className={classes.balance}>
                {tokenBalance != null ? tokenBalance : "fetching"}
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
