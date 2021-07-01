import classNames from "classnames";
import { useState } from "react";
// import AutoSizer from 'react-virtualized-auto-sizer'
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectActiveTokens } from "../../features/metadata/metadataSlice";
import { TokenInfo } from "@uniswap/token-lists";
import {
    selectBalances,
  } from "../../features/balances/balancesSlice";

type TokenRowPropTypes = {
    token: TokenInfo,
    balance: string
  };

const TokenRow = ({token, balance}: TokenRowPropTypes) => {
    return (
        <div className="flex flex-wrap">
            <img src={token.logoURI} alt="hello token" className="w-12"/>
            <h3>{token.symbol}</h3>
            <h4>{token.name}</h4>
            <h4>{balance}</h4>
        </div>
    )
}

const TokenSelection = () => {

  const [tokenQuery, setTokenQuery] = useState<string>();
  const [tokenList, setTokenList] = useState();
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);

  // filter token

  return (
    <div>
      <div>
        <h1>Select token</h1>
      </div>
      <input
        type="text"
        value={tokenQuery}
        placeholder="Search name or paste address"
        onChange={(e) => {
          setTokenQuery(e.target.value);
        }}
      />
      <div>
        {activeTokens.map(token => {
            return <TokenRow token={token} balance={balances.values[token.address] || "0.0"}/>
        })}
      </div>
    </div>
  );
};

export default TokenSelection;
