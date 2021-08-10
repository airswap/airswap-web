import { TokenInfo } from "@uniswap/token-lists";

import classNames from "classnames";

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
   * Whether to disable selection of this token (e.g. if already selected)
   */
  disabled?: boolean;
  /**
   * Removes token from the active tokens list.
   */
  removeActiveToken: (tokenAddress: string) => void;
  /**
   * Flag that determines if this is a default token that is automatically active.
   */
  defaultToken: boolean;
};

// TODO: Make Container a button instead of a div
const TokenRow = ({
  token,
  balance,
  setToken,
  removeActiveToken,
  disabled,
  defaultToken,
}: TokenRowProps) => {
  return (
    <div
      className={classNames(
        "grid items-center grid-flow-col hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer w-full",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      style={{
        gridTemplateColumns: "auto minmax(auto, 1fr) auto minmax(0, 72px)",
        gridGap: "16px",
      }}
      onClick={(e) => {
        !disabled && setToken(token.address);
      }}
    >
      <img
        src={token.logoURI || "https://via.placeholder.com/150"}
        className="w-6"
        alt="hello"
      />
      <div className="flex flex-col justify-start">
        <h3 className="flex flex-col">{token.symbol}</h3>
        <h3 className="text-gray-400">
          {token.name}{" "}
          {!defaultToken && (
            <>
              •{" "}
              <span
                className="cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  removeActiveToken(token.address);
                }}
              >
                Remove from active
              </span>
            </>
          )}
        </h3>
      </div>
      <span></span>
      <div className="justify-self-end max-w-md">{balance}</div>
    </div>
  );
};

export default TokenRow;
