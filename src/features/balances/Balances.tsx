import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../app/hooks";
import { selectActiveTokens } from "../metadata/metadataSlice";
import classes from "./Balances.module.css";
import { selectAllowances, selectBalances } from "./balancesSlice";

const Balances = () => {
  const { active } = useWeb3React();
  const activeTokens = useAppSelector(selectActiveTokens);
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
      {/* <button type="button" onClick={fetchBalancesAndAllowances}>
        Update balances
      </button> */}
      <hr />
    </div>
  ) : null;
};

export default Balances;
