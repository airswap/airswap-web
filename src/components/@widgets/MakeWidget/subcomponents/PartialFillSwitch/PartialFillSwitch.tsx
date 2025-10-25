import { FC } from "react";

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
  return (
    <Container disabled={!value} className={className}>
      <RadioContainer
        to={value ? routes.makeOtcOrder() : routes.makeLimitOrder()}
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
