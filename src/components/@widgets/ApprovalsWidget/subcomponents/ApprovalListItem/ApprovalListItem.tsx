import { FC, useRef } from "react";

import { Contract, Swap } from "@airswap/libraries";
import { Delegate, Wrapper } from "@airswap/libraries";
import { SwapERC20 } from "@airswap/libraries";
import { getAccountUrl } from "@airswap/utils";
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
  StyledActionButton,
  ActionButtonContainer,
  Amount,
  Container,
  TokenImage,
  TokenImageAndNameContainer,
  TokenLink,
  TokenName,
  ContractContainer,
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
  className?: string;
};

export const ApprovalListItem: FC<ApprovalListItemProps> = ({
  approval,
  onEditButtonClick,
  className,
}) => {
  const { chainId } = useWeb3React();
  const contractAddress = getContractAddress(chainId || 1, approval.contract);
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
      <ContractContainer>
        <Amount>{contractLabels[approval.contract]}</Amount>
        {contractAddress && chainId && (
          <TokenLink address={contractAddress} chainId={chainId} />
        )}
      </ContractContainer>
      <ActionButtonContainer>
        {approval.tokenInfo && (
          <StyledActionButton onClick={handleEditButtonClick}>
            {isTokenInfo(approval.tokenInfo) ? "Edit" : "Revoke"}
          </StyledActionButton>
        )}
      </ActionButtonContainer>
    </Container>
  );
};

const getContractAddress = (chainId: number, contract: SpenderAddressType) => {
  switch (contract) {
    case "Swap":
      return Swap.getAddress(chainId);
    case "SwapERC20":
      return SwapERC20.getAddress(chainId);
    case "Wrapper":
      return Wrapper.getAddress(chainId);
    case "Delegate":
      return Delegate.getAddress(chainId);
    default:
      return null;
  }
};
