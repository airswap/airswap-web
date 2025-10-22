import { FC, useRef } from "react";

import { Swap } from "@airswap/libraries";
import { Delegate, Wrapper } from "@airswap/libraries";
import { SwapERC20 } from "@airswap/libraries";
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
  contractLabels,
  featureLabels,
} from "../ApprovalListItem/ApprovalListItem";
import {
  StyledActionButton,
  ItemValue,
  Container,
  TokenImage,
  TokenImageAndNameContainer,
  TokenLink,
  TokenName,
  ItemLabel,
  Divider,
  ItemContainer,
  ItemSubContainer,
  ContractLink,
} from "./MobileApprovalListItem.styles";

type MobileApprovalListItemProps = {
  approval: ApprovalEntity;
  onEditButtonClick: (approval: ApprovalEntity) => void;
  className?: string;
};

export const MobileApprovalListItem: FC<MobileApprovalListItemProps> = ({
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

  const handleEditButtonClick = () => {
    onEditButtonClick(approval);
  };

  return (
    <Container className={className}>
      <TokenImageAndNameContainer ref={tokenContainerRef}>
        <TokenImage backgroundImage={image} />
        <TokenName>
          <ItemLabel>Token</ItemLabel>
          {name}
        </TokenName>
        {tokenAddress && chainId && (
          <TokenLink address={tokenAddress} chainId={chainId} />
        )}
      </TokenImageAndNameContainer>

      <Divider />

      <ItemContainer>
        <ItemSubContainer>
          <ItemLabel>Balance</ItemLabel>
          <ItemValue>{roundedBalance}</ItemValue>
        </ItemSubContainer>
        <ItemSubContainer>
          <ItemLabel>Allowance</ItemLabel>
          <ItemValue>{roundedAllowance}</ItemValue>
        </ItemSubContainer>
      </ItemContainer>

      <Divider />

      <ItemContainer>
        <ItemSubContainer>
          <ItemLabel>Contract</ItemLabel>
          <ItemValue>
            {contractLabels[approval.contract]}
            {contractAddress && chainId && (
              <ContractLink address={contractAddress} chainId={chainId} />
            )}
          </ItemValue>
        </ItemSubContainer>
        <ItemSubContainer>
          <ItemLabel>Feature</ItemLabel>
          <ItemValue>{featureLabels[approval.contract]}</ItemValue>
        </ItemSubContainer>
      </ItemContainer>

      {approval.tokenInfo && (
        <StyledActionButton onClick={handleEditButtonClick}>
          {/* {isTokenInfo(approval.tokenInfo) ? "Edit" : "Revoke"} */}
          Revoke
        </StyledActionButton>
      )}
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
