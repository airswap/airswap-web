import { FC } from "react";

import { formatUnits } from "ethers/lib/utils";

import {
  getTokenDecimals,
  getTokenImage,
  getTokenSymbol,
} from "../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { ApprovalEntity } from "../../../../../entities/ApprovalEntity/ApprovalEntity";
import { SpenderAddressType } from "../../../../../features/balances/balancesApi";
import stringToSignificantDecimals from "../../../../../helpers/stringToSignificantDecimals";
import {
  ActionButton,
  ActionButtonContainer,
  Amount,
  Container,
  TokenImage,
  TokenImageAndNameContainer,
  TokenName,
} from "./ApprovalListItem.styles";

const contractLabels: Record<SpenderAddressType, string> = {
  Wrapper: "Wrapper",
  Swap: "Swap (NFTS)",
  SwapERC20: "Swap ERC-20",
  Delegate: "Delegate",
};

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
      <Amount>{contractLabels[approval.contract]}</Amount>
      <ActionButtonContainer>
        <ActionButton>Edit</ActionButton>
        <ActionButton>Revoke</ActionButton>
      </ActionButtonContainer>
    </Container>
  );
};
