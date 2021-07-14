import classNames from "classnames";
import { TokenInfo } from "@uniswap/token-lists";

export type TokenRowProps = {
  /**
   * TokenInfo object
   */
  token: TokenInfo;
  /**
   * Balance of current token
   */
  balance: string;
  /**
   * onClick event, either setSignerToken or setSenderToken
   */
  setToken: (val: string) => void;
  /**
   * Whether counterpart token is already selected; Still allows user to select that token
   */
  selected?: boolean;
  /**
   * Whether current token is already selected; Prevents token row click
   */
  disabled?: boolean;
  /**
   * Removes token from the active tokens list.
   */
  removeActiveToken: any;
  /**
   * Flag that determines if this is a default token that is automatically active.
   */
   defaultToken: boolean;
};

const TokenRow = ({
  token,
  balance,
  setToken,
  removeActiveToken,
  selected,
  disabled,
  defaultToken,
}: TokenRowProps) => {
  return (
    <div
      className={classNames(
        "grid items-center grid-flow-col hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer",
        selected && "opacity-40",
        disabled && "opacity-40 pointer-events-none"
      )}
      style={{
        gridTemplateColumns: "auto minmax(auto, 1fr) auto minmax(0, 72px)",
        gridGap: "16px",
      }}
      onClick={() => !disabled && setToken(token.address)}
    >
      <img
        src={token.logoURI || "https://via.placeholder.com/150"}
        className="w-6"
        alt="hello"
      />
      <div className="flex flex-col justify-start">
        <h3 className="flex flex-col">{token.symbol}</h3>
        <h3 className="text-gray-400">{token.name} {!defaultToken && <>• <span onClick={() => removeActiveToken(token.address)}>Remove from active</span></>}</h3>
      </div>
      <span></span>
      <div className="justify-self-end max-w-md">{balance}</div>
    </div>
  );
};

export default TokenRow;
