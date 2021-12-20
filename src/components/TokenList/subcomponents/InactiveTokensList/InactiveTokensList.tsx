import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import {
  InactiveTitle,
  InactiveTitleContainer,
  InformationIcon,
  TokenContainer,
} from "../../TokenList.styles";
import TokenImportButton from "../TokenImportButton/TokenImportButton";

type InactiveTokensListProps = {
  inactiveTokens: TokenInfo[];
  supportedTokenAddresses: string[];
  onTokenClick: (tokenAddress: string) => void;
};

const InactiveTokensList = ({
  supportedTokenAddresses,
  inactiveTokens,
  onTokenClick,
}: InactiveTokensListProps) => {
  const { t } = useTranslation();

  return (
    <>
      <InactiveTitleContainer>
        <InactiveTitle>
          {t("orders.expandedResults")}
          <InformationIcon name="information-circle-outline" />
        </InactiveTitle>
      </InactiveTitleContainer>
      <TokenContainer>
        {inactiveTokens.map((token) => (
          <TokenImportButton
            token={token}
            isUnsupported={
              supportedTokenAddresses.length !== 0 &&
              !supportedTokenAddresses.includes(token.address)
            }
            onClick={() => onTokenClick(token.address)}
            key={`${token.address}`}
          />
        ))}
      </TokenContainer>
    </>
  );
};

export default InactiveTokensList;
