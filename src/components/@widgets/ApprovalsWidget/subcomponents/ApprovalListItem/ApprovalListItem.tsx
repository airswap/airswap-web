import { FC, useRef } from "react";

import { formatUnits } from "ethers/lib/utils";

import {
  getTokenDecimals,
  getTokenImage,
  getTokenSymbol,
} from "../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { ApprovalEntity } from "../../../../../entities/ApprovalEntity/ApprovalEntity";
import { SpenderAddressType } from "../../../../../features/balances/balancesApi";
import stringToSignificantDecimals from "../../../../../helpers/stringToSignificantDecimals";
import useElementSize from "../../../../../hooks/useElementSize";
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
  const tokenContainerRef = useRef<HTMLDivElement>(null);
  const { width: tokenContainerWidth } = useElementSize(tokenContainerRef);
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

  const minFontSize = 16;
  const maxFontSize = 20;
  const tokenNameFontSize = Math.max(
    minFontSize,
    Math.min(maxFontSize, 30 - (name?.length || 0) * 1.2)
  );

  return (
    <Container className={className}>
      <TokenImageAndNameContainer ref={tokenContainerRef}>
        <TokenImage backgroundImage={image} />
        <TokenName style={{ fontSize: `${tokenNameFontSize}px` }}>
          {name}
        </TokenName>
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
