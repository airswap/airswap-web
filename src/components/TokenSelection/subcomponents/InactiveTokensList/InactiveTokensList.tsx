import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@uniswap/token-lists";

import {
  InactiveTitle,
  InactiveTitleContainer,
  InformationIcon,
  TokenContainer,
} from "../../TokenSelection.styles";
import { filterTokens } from "../../filter";
import { sortTokensBySymbol } from "../../sort";
import TokenImportButton from "../TokenImportButton/TokenImportButton";

type InactiveTokensListProps = {
  tokenQuery: string;
  allTokens: TokenInfo[];
  activeTokens: TokenInfo[];
  onTokenClick: (tokenAddress: string) => void;
};

const InactiveTokensList = ({
  tokenQuery,
  allTokens,
  activeTokens,
  onTokenClick,
}: InactiveTokensListProps) => {
  const { t } = useTranslation(["orders"]);

  // sort inactive tokens based on symbol
  const sortedInactiveTokens: TokenInfo[] = useMemo(() => {
    return sortTokensBySymbol(
      allTokens.filter((el) => {
        return !activeTokens.includes(el);
      })
    );
  }, [allTokens, activeTokens]);

  // only take the top 10 tokens
  const inactiveTokens: TokenInfo[] = useMemo(() => {
    return filterTokens(Object.values(sortedInactiveTokens), tokenQuery!).slice(
      0,
      10
    );
  }, [sortedInactiveTokens, tokenQuery]);

  return (
    <>
      <InactiveTitleContainer>
        <InactiveTitle>
          {t("orders:expandedResults")}
          <InformationIcon name="information-circle-outline" />
        </InactiveTitle>
      </InactiveTitleContainer>
      <TokenContainer>
        {inactiveTokens.map((token) => (
          <TokenImportButton
            token={token}
            onClick={() => onTokenClick(token.address)}
            key={`${token.address}`}
          />
        ))}
      </TokenContainer>
    </>
  );
};

export default InactiveTokensList;
