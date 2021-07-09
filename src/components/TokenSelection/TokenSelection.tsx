import { useState, useMemo } from "react";
// import AutoSizer from 'react-virtualized-auto-sizer'
import { useAppSelector } from "../../app/hooks";
import { selectActiveTokens } from "../../features/metadata/metadataSlice";
import { TokenInfo } from "@uniswap/token-lists";
import { selectBalances } from "../../features/balances/balancesSlice";
import { HiX } from "react-icons/hi";
import { formatUnits } from "@ethersproject/units";
import { filterTokens } from "./filter";
import { sortTokensByBalance, sortTokensBySymbol } from "./sort";
import TokenRow from "./TokenRow";

export type TokenSelectionProps = {
  closeModal: () => void;
  signerToken: string;
  senderToken: string;
  setSignerToken: (val: string) => void;
  setSenderToken: (val: string) => void;
  tokenSelectType: "signerToken" | "senderToken";
};

const TokenSelection = ({
  closeModal,
  signerToken,
  senderToken,
  setSignerToken,
  setSenderToken,
  tokenSelectType,
}: TokenSelectionProps) => {
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
    return sortTokensBySymbol(activeTokens);
  }, [activeTokens]);

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
