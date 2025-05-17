import { FC, useRef } from "react";

import { useWeb3React } from "@web3-react/core";

import { formatUnits } from "ethers/lib/utils";

import {
  getTokenDecimals,
  getTokenImage,
  getTokenSymbol,
  isTokenInfo,
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
  TokenLink,
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
  onEditButtonClick: (approval: ApprovalEntity) => void;
  onRevokeButtonClick: (approval: ApprovalEntity) => void;
  className?: string;
};

export const ApprovalListItem: FC<ApprovalListItemProps> = ({
  approval,
  onEditButtonClick,
  onRevokeButtonClick,
  className,
}) => {
  const { chainId } = useWeb3React();
  const tokenContainerRef = useRef<HTMLDivElement>(null);
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
  const tokenAddress = approval.tokenInfo?.address;

  const roundedAllowance = stringToSignificantDecimals(allowance);
  const roundedBalance = stringToSignificantDecimals(balance);

  const minFontSize = 16;
  const maxFontSize = 20;
  const tokenNameFontSize = Math.max(
    minFontSize,
    Math.min(maxFontSize, 30 - (name?.length || 0) * 1.2)
  );

  const handleEditButtonClick = () => {
    onEditButtonClick(approval);
  };

  return (
    <Container className={className}>
      <TokenImageAndNameContainer ref={tokenContainerRef}>
        <TokenImage backgroundImage={image} />
        <TokenName style={{ fontSize: `${tokenNameFontSize}px` }}>
          {name}
        </TokenName>
        {tokenAddress && chainId && (
          <TokenLink address={tokenAddress} chainId={chainId} />
        )}
      </TokenImageAndNameContainer>
      <Amount>{roundedBalance}</Amount>
      <Amount>{roundedAllowance}</Amount>
      <Amount>{contractLabels[approval.contract]}</Amount>
      <ActionButtonContainer>
        {approval.tokenInfo && (
          <ActionButton onClick={handleEditButtonClick}>
            {isTokenInfo(approval.tokenInfo) ? "Edit" : "Revoke"}
          </ActionButton>
        )}
      </ActionButtonContainer>
    </Container>
  );
};
