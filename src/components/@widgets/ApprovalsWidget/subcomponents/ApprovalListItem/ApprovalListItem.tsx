import { FC } from "react";

import { formatUnits } from "ethers/lib/utils";

import {
  getTokenDecimals,
  getTokenImage,
  getTokenSymbol,
} from "../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { ApprovalEntity } from "../../../../../entities/ApprovalEntity/ApprovalEntity";
import stringToSignificantDecimals from "../../../../../helpers/stringToSignificantDecimals";
import {
  Amount,
  Container,
  TokenImage,
  TokenImageAndNameContainer,
  TokenName,
} from "./ApprovalListItem.styles";

type ApprovalListItemProps = {
  approval: ApprovalEntity;
  className?: string;
};

export const ApprovalListItem: FC<ApprovalListItemProps> = ({
  approval,
  className,
}) => {
  const image = approval.tokenInfo
    ? getTokenImage(approval.tokenInfo)
    : undefined;
  const decimals = approval.tokenInfo
    ? getTokenDecimals(approval.tokenInfo)
    : 0;
  const allowance = formatUnits(approval.allowance, decimals);
  const balance = formatUnits(approval.balance, decimals);
  const name = approval.tokenInfo
    ? getTokenSymbol(approval.tokenInfo)
    : undefined;

  const roundedAllowance = stringToSignificantDecimals(allowance);
  const roundedBalance = stringToSignificantDecimals(balance);

  return (
    <Container className={className}>
      <TokenImageAndNameContainer>
        <TokenImage backgroundImage={image} />
        <TokenName>{name}</TokenName>
      </TokenImageAndNameContainer>
      <Amount>{roundedBalance}</Amount>
      <Amount>{roundedAllowance}</Amount>
      <Amount>{approval.contract}</Amount>
    </Container>
  );
};
