import { useTranslation } from "react-i18next";

import { TokenInfo } from "@uniswap/token-lists";

import classNames from "classnames";

export type TokenImportRowProps = {
  /**
   * TokenInfo object
   */
  token: TokenInfo;
  /**
   * onClick event, either setSignerToken or setSenderToken
   */
  onClick: (val: string) => void;
};

const TokenImportRow = ({ token, onClick }: TokenImportRowProps) => {
  const { t } = useTranslation(["balances", "common"]);

  return (
    <div
      className={classNames(
        "grid items-center grid-flow-col hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer w-full"
      )}
      style={{
        gridTemplateColumns: "auto minmax(auto, 1fr) auto minmax(0, 72px)",
        gridGap: "16px",
      }}
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
      <button
        className="justify-self-end max-w-md"
        onClick={() => onClick(token.address)}
      >
        {t("balances:addToTokenSet")}
      </button>
    </div>
  );
};

export default TokenImportRow;
