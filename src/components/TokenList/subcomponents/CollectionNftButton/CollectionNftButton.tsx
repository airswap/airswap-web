import { FC } from "react";
import { useTranslation } from "react-i18next";

import { CollectionTokenInfo } from "@airswap/utils";

import { getTokenImage } from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { ImportButton } from "../../TokenList.styles";
import {
  Container,
  StyledIcon,
  StyledTokenLogo,
  TokenName,
  TextContainer,
  TokenId,
} from "./CollectionNftButton.styles";

type CollectionNftButtonProps = {
  className?: string;
  token: CollectionTokenInfo;
  onSelectToken: (token: CollectionTokenInfo) => void;
};

export const CollectionNftButton: FC<CollectionNftButtonProps> = ({
  className,
  token,
  onSelectToken,
}) => {
  const { t } = useTranslation();
  const image = getTokenImage(token);
  const tokenId = token.id.toString();

  return (
    <Container className={className}>
      <StyledTokenLogo logoURI={image} />
      <TextContainer>
        <TokenName>{token.name}</TokenName>
        <TokenId>{`#${tokenId}`}</TokenId>
      </TextContainer>

      <ImportButton onClick={() => onSelectToken(token)}>
        {t("common.select")}
      </ImportButton>
    </Container>
  );
};
