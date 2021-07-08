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
import { sortTokensByBalance } from "./sort";

type TokenRowPropTypes = {
  token: TokenInfo;
  balance: string;
  onClick?: any;
  selected?: boolean;
  disabled?: boolean;
};

const TokenRow = ({
  token,
  balance,
  onClick,
  selected,
  disabled,
}: TokenRowPropTypes) => {
  return (
    <div
      className={classNames(
        "grid items-center grid-flow-col hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer",
        selected && "bg-primary-400",
        disabled && "bg-red-400"
      )}
      style={{
        gridTemplateColumns: "auto minmax(auto, 1fr) auto minmax(0, 72px)",
        gridGap: "16px",
      }}
      onClick={() => !disabled && onClick(token.address)}
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
  signerToken: string;
  senderToken: string;
  setSignerToken: any;
  setSenderToken: any;
  tokenSelectType: "signerToken" | "senderToken";
};

const TokenSelection = ({
  closeModal,
  signerToken,
  senderToken,
  setSignerToken,
  setSenderToken,
  tokenSelectType,
}: TokenSelectionPropTypes) => {
  const [tokenQuery, setTokenQuery] = useState<string>("");
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);

  // handle user clicking row
  const handleClick = (address: string) => {
    if (tokenSelectType === "senderToken") {
      // swap the token addresses
      if (address === signerToken) setSignerToken(senderToken);
      setSenderToken(address);
    } else {
      if (address === senderToken) setSenderToken(signerToken);
      setSignerToken(address);
    }
    closeModal();
  };

  // sort tokens based on balance
  const sortedTokens: TokenInfo[] = useMemo(() => {
    return sortTokensByBalance(activeTokens, balances);
  }, [activeTokens, balances]);

  // filter token
  const filteredTokens: TokenInfo[] = useMemo(() => {
    return filterTokens(Object.values(sortedTokens), tokenQuery!);
  }, [sortedTokens, tokenQuery]);

  return (
    <div>
      <div className="flex flex-wrap align-middle justify-between">
        <h1 className="font-bold text-sm">Select token</h1>
        <HiX
          className="light:text-black text-xl cursor-pointer"
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
        className="w-full"
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
              selected={
                tokenSelectType === "senderToken"
                  ? token.address === signerToken
                  : token.address === senderToken
              } // should be grayed out, but still clickable
              disabled={
                tokenSelectType === "senderToken"
                  ? token.address === senderToken
                  : token.address === signerToken
              } // shouldn't be able to select same duplicate token
            />
          );
        })}
      </div>
    </div>
  );
};

export default TokenSelection;
