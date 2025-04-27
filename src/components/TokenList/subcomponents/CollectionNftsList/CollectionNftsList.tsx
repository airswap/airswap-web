import { FC } from "react";

import { CollectionTokenInfo } from "@airswap/utils";

import { getTokenId } from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { CollectionNftButton } from "../CollectionNftButton/CollectionNftButton";
import { ScrollContainer } from "../ScrollContainer/ScrollContainer";
import {
  TokensScrollContainer,
  TokensContainer,
  TokenListLoader,
} from "./CollectionNftsList.styles";

type CollectionNftsListProps = {
  className?: string;
  tokens: CollectionTokenInfo[];
  tokenQuery: string;
  onSelectToken: (token: CollectionTokenInfo) => void;
};

export const CollectionNftsList: FC<CollectionNftsListProps> = ({
  className,
  tokens,
  tokenQuery,
  onSelectToken,
}) => {
  const filteredTokens = tokens.filter(
    (token) =>
      token.name?.toLowerCase().includes(tokenQuery.toLowerCase()) ||
      token.id?.toString().includes(tokenQuery)
  );

  return (
    <TokensScrollContainer className={className}>
      <ScrollContainer resizeDependencies={[filteredTokens]}>
        <TokensContainer>
          {filteredTokens.map((token) => (
            <CollectionNftButton
              key={getTokenId(token)}
              token={token}
              onSelectToken={onSelectToken}
            />
          ))}
        </TokensContainer>
      </ScrollContainer>
    </TokensScrollContainer>
  );
};
