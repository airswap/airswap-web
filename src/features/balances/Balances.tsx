import { Fragment, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllowances, selectBalances } from "./balancesSlice";
import classes from "./Balances.module.css";
import { formatUnits } from "@ethersproject/units";
import { addActiveToken, selectActiveTokens } from "../metadata/metadataSlice";

const Balances: FC<{}> = () => {
  const { active } = useWeb3React();
  const activeTokens = useAppSelector(selectActiveTokens);
  console.log(activeTokens);
  const dispatch = useAppDispatch();
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);

  const [addTokenField, setAddTokenField] = useState<string>("");

  return active ? (
    <div>
      <hr />
      <h4>Token Balances</h4>
      <div className={classes.balancesGrid}>
        <span className={classes.bold}>Symbol</span>
        <span className={classes.bold}>Balance</span>
        <span className={classes.bold}>Allowance</span>
        {activeTokens.map((tokenInfo) => {
          const tokenBalance = balances.values[tokenInfo.address];
          const tokenAllowance = allowances.values[tokenInfo.address];
          return (
            <Fragment key={`${tokenInfo.address}-balance`}>
              <span>{tokenInfo.symbol}:</span>
              <span>
                {tokenBalance != null
                  ? formatUnits(tokenBalance, tokenInfo.decimals)
                  : "fetching"}
              </span>
              <span>
                {tokenAllowance != null
                  ? formatUnits(tokenAllowance, tokenInfo.decimals)
                  : "fetching"}
              </span>
            </Fragment>
          );
        })}
      </div>
      <input
        type="text"
        onChange={(e) => {
          setAddTokenField(e.target.value);
        }}
      />
      <button
        type="button"
        onClick={() => {
          dispatch(addActiveToken(addTokenField));
          setAddTokenField("");
        }}
      >
        Add to token set
      </button>
      {/* <button type="button" onClick={fetchBalancesAndAllowances}>
        Update balances
      </button> */}
      <hr />
    </div>
  ) : null;
};

export default Balances;
