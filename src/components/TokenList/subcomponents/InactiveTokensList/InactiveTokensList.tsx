import { useTranslation } from "react-i18next";

import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenId } from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import {
  InactiveTitle,
  InactiveTitleContainer,
  InformationIcon,
  TokensContainer,
} from "../../TokenList.styles";
import TokenImportButton from "../TokenImportButton/TokenImportButton";

type InactiveTokensListProps = {
  inactiveTokens: AppTokenInfo[];
  supportedTokenAddresses: string[];
  onTokenClick: (tokenInfo: AppTokenInfo) => void;
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
      <TokensContainer>
        {inactiveTokens.map((token) => (
          <TokenImportButton
            key={getTokenId(token)}
            token={token}
            isUnsupported={
              supportedTokenAddresses.length !== 0 &&
              !supportedTokenAddresses.includes(token.address)
            }
            onClick={() => onTokenClick(token)}
          />
        ))}
      </TokensContainer>
    </>
  );
};

export default InactiveTokensList;
