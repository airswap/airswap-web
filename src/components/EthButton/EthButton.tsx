import { formatUnits } from "ethers/lib/utils";

import { InfoHeading } from "../Typography/Typography";
import { Container } from "./EthButton.styles";

type EthButtonPropType = {
  balance: string;
};

const EthButton = ({ balance = "0" }: EthButtonPropType) => {
  return (
    <Container>
      <InfoHeading>{formatUnits(balance).substring(0, 5)} ETH</InfoHeading>
    </Container>
  );
};

export default EthButton;
