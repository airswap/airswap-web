import { FC } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../../../../app/hooks";
import { getDelegateContract } from "../../../../../entities/DelegateRule/DelegateRuleHelpers";
import { routes } from "../../../../../routes";
import {
  Container,
  Description,
  RadioCircle,
  RadioContainer,
  TextContainer,
  Title,
} from "./PartialFillSwitch.styles";

type PartialFillSwitchProps = {
  value: boolean;
  className?: string;
};

export const PartialFillSwitch: FC<PartialFillSwitchProps> = ({
  value,
  className,
}) => {
  const { provider } = useWeb3React();
  const { chainId } = useAppSelector((state) => state.web3);
  const isDelegateRuleSupported =
    provider && chainId ? getDelegateContract(provider, chainId) : true;

  return (
    <Container
      active={!value}
      disabled={!isDelegateRuleSupported}
      className={className}
    >
      <RadioContainer
        to={value ? routes.makeOtcOrder() : routes.makeLimitOrder()}
        aria-disabled={!isDelegateRuleSupported}
      >
        <RadioCircle />
      </RadioContainer>

      <TextContainer>
        <Title>Enable Partial Fill</Title>
        <Description>
          Multiple users can contribute to fulfill the order.
        </Description>
      </TextContainer>
    </Container>
  );
};
