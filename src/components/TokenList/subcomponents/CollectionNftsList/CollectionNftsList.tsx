import { FC } from "react";

import { CollectionTokenInfo } from "@airswap/utils";

import { getTokenId } from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { getUniqueArrayChildren } from "../../../../helpers/array";
import { FadedScrollContainer } from "../../../FadedScrollContainer/FadedScrollContainer";
import { CollectionNftButton } from "../CollectionNftButton/CollectionNftButton";
import {
  TokensScrollContainer,
  TokensContainer,
  TokenListLoader,
} from "./CollectionNftsList.styles";

type CollectionNftsListProps = {
  className?: string;
  isLoading: boolean;
  tokens: CollectionTokenInfo[];
  tokenQuery: string;
  onSelectToken: (token: CollectionTokenInfo) => void;
};

export const CollectionNftsList: FC<CollectionNftsListProps> = ({
  className,
  isLoading,
  tokens,
  tokenQuery,
  onSelectToken,
}) => {
  const filteredTokens = getUniqueArrayChildren(tokens, "id").filter(
    (token) =>
      token.name?.toLowerCase().includes(tokenQuery.toLowerCase()) ||
      token.id?.toString().includes(tokenQuery)
  );

  return (
    <TokensScrollContainer className={className}>
      <FadedScrollContainer resizeDependencies={[filteredTokens]}>
        <TokensContainer>
          {filteredTokens.map((token) => (
            <CollectionNftButton
              key={getTokenId(token)}
              token={token}
              onSelectToken={onSelectToken}
            />
          ))}
        </TokensContainer>
      </FadedScrollContainer>

      {isLoading && <TokenListLoader />}
    </TokensScrollContainer>
  );
};
