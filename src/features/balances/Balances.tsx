import { Fragment, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  requestActiveTokenAllowances,
  requestActiveTokenBalances,
  selectAllowances,
  selectBalances,
} from "./balancesSlice";
import classes from "./Balances.module.css";
import { formatUnits } from "@ethersproject/units";
import { addActiveToken, selectActiveTokens } from "../metadata/metadataSlice";
import { useTranslation } from "react-i18next";

const Balances: FC<{}> = () => {
  const { active, library } = useWeb3React();
  const activeTokens = useAppSelector(selectActiveTokens);
  const dispatch = useAppDispatch();
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);

  const [addTokenField, setAddTokenField] = useState<string>("");

  const { t } = useTranslation(["balances", "common"]);

  return active ? (
    <div>
      <hr />
      <h4>{t("balances:tokenBalances")}</h4>
      <div className={classes.balancesGrid}>
        <span className={classes.bold}>{t("balances:symbol")}</span>
        <span className={classes.bold}>{t("balances:balance")}</span>
        <span className={classes.bold}>{t("balances:allowance")}</span>
        {activeTokens.map((tokenInfo) => {
          const tokenBalance = balances.values[tokenInfo.address];
          const tokenAllowance = allowances.values[tokenInfo.address];
          return (
            <Fragment key={`${tokenInfo.address}-balance`}>
              <span>{tokenInfo.symbol}:</span>
              <span>
                {tokenBalance != null
                  ? formatUnits(tokenBalance, tokenInfo.decimals)
                  : t("common:fetching")}
              </span>
              <span>
                {tokenAllowance != null
                  ? formatUnits(tokenAllowance, tokenInfo.decimals)
                  : t("common:fetching")}
              </span>
            </Fragment>
          );
        })}
      </div>
      <input
        type="text"
        value={addTokenField}
        onChange={(e) => {
          setAddTokenField(e.target.value);
        }}
      />
      <button
        type="button"
        onClick={() => {
          dispatch(addActiveToken(addTokenField));
          dispatch(requestActiveTokenBalances({ provider: library }));
          dispatch(requestActiveTokenAllowances({ provider: library }));
          setAddTokenField("");
        }}
      >
        {t("balances:addToTokenSet")}
      </button>
      {/* <button type="button" onClick={fetchBalancesAndAllowances}>
        Update balances
      </button> */}
      <hr />
    </div>
  ) : null;
};

export default Balances;
