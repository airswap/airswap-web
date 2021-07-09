import { useEffect, useState } from "react";
import classNames from "classnames";
import { TokenInfo } from "@uniswap/token-lists";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

type TokenSelectPropTypes = {
  withAmount: boolean;
  quoteAmount?: string | null;
  label: string;
  className?: string;
  amount?: string;
  token?: string;
  tokens: TokenInfo[];
  hasError?: boolean;
  onAmountChange?: React.FormEventHandler<HTMLInputElement>;
  onTokenChange?: React.FormEventHandler<HTMLSelectElement>;
};

const TokenSelect = ({
  withAmount,
  quoteAmount,
  label,
  className,
  tokens,
  amount,
  onAmountChange,
  token,
  onTokenChange,
  hasError = false,
}: TokenSelectPropTypes) => {
  const { t } = useTranslation(["common", "orders"]);
  const { chainId } = useWeb3React<Web3Provider>();
  const [
    isDefaultOptionDisabled,
    setIsDefaultOptionDisabled,
  ] = useState<boolean>(false);

  useEffect(() => {
    setIsDefaultOptionDisabled(false);
  }, [chainId]);

  return (
    <div className={classNames("flex flex-col", className)}>
      <div className="font-bold text-sm">{label}</div>
      <div
        className={classNames(
          "flex justify-between pb-1 items-center",
          "border-b border-black border-opacity-20",
          "dark:border-white  dark:border-opacity-20"
        )}
      >
        {/* Amount input */}
        {withAmount ? (
          <input
            type="text"
            className={classNames(
              "bg-transparent border-0 px-0 py-0",
              "placeholder-gray-500 text-sm",
              hasError ? "dark:text-red-700 text-red-700" : "dark:text-white"
            )}
            value={amount}
            onChange={onAmountChange}
            placeholder="0"
          ></input>
        ) : (
          <span className="text-gray-500 text-sm">
            {!token ? t("orders:chooseToken") : quoteAmount}
          </span>
        )}

        {/* Token Selector */}
        <div className="flex font-bold items-center">
          {tokens ? (
            <select
              dir="rtl"
              className={classNames(
                "-mr-6 pr-6 border-0 bg-transparent appearance-none",
                "text-sm",
                "dark:text-white",
                {
                  "text-gray-500": !token,
                }
              )}
              value={isDefaultOptionDisabled ? token : `…${t("common:select")}`}
              onChange={(e) => {
                if (onTokenChange) onTokenChange(e);
                setIsDefaultOptionDisabled(true);
              }}
            >
              <option disabled={isDefaultOptionDisabled}>
                …{t("common:select")}
              </option>
              {tokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          ) : (
            <LoadingSpinner className="mx-2" />
          )}
          <HiOutlineChevronRight className="text-primary text-xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TokenSelect;
