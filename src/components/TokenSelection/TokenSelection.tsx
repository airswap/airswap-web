import classNames from "classnames";
import { useState, useMemo } from "react";
// import AutoSizer from 'react-virtualized-auto-sizer'
import { useAppSelector } from "../../app/hooks";
import { selectActiveTokens } from "../../features/metadata/metadataSlice";
import { TokenInfo } from "@uniswap/token-lists";
import { selectBalances } from "../../features/balances/balancesSlice";
import { HiX } from "react-icons/hi";
import { formatUnits } from "@ethersproject/units";
import { filterTokens } from "./filter";

type TokenRowPropTypes = {
  token: TokenInfo;
  balance: string;
  onClick?: any;
};

const TokenRow = ({ token, balance, onClick }: TokenRowPropTypes) => {
  return (
    <div
      className="grid items-center grid-flow-col hover:bg-gray-500 cursor-pointer"
      style={{
        gridTemplateColumns: "auto minmax(auto, 1fr) auto minmax(0, 72px)",
        gridGap: "16px",
      }}
      onClick={() => onClick(token.address)}
    >
      <img
        src={token.logoURI || "https://via.placeholder.com/150"}
        className="w-6"
        alt="hello"
      />
      <div className="flex flex-col justify-start">
        <h3 className="flex flex-col">{token.symbol}</h3>
        <h3 className="text-gray-400">{token.name}</h3>
      </div>
      <span></span>
      <div className="justify-self-end max-w-md">{balance}</div>
    </div>
  );
};

type TokenSelectionPropTypes = {
  closeModal: any;
  disabled?: boolean;
  selected?: boolean;
  onClick: any;
};

const TokenSelection = ({ closeModal, onClick }: TokenSelectionPropTypes) => {
  const [tokenQuery, setTokenQuery] = useState<string>("");
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);

  // filter token

  const handleClick = (address: string) => {
    onClick(address);
    closeModal();
  }

  const filteredTokens: TokenInfo[] = useMemo(() => {
    return filterTokens(Object.values(activeTokens), tokenQuery!)
  }, [activeTokens, tokenQuery])

  return (
    <div>
      <div className="flex flex-wrap align-middle justify-between">
        <h1 className="font-bold text-sm">Select token</h1>
        <HiX
          className="text-black text-xl cursor-pointer"
          onClick={closeModal}
        />
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
        {filteredTokens.map((token) => {
          return (
            <TokenRow
              token={token}
              balance={
                formatUnits(balances.values[token.address]!, token.decimals) ||
                "0.0"
              }
              onClick={handleClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TokenSelection;
