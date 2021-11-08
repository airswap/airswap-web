import { formatUnits } from "ethers/lib/utils";

import { InfoHeading } from "../Typography/Typography";
import { StyledEthBalance } from "./EthButton.styles";

type EthButtonPropType = {
  balance: string;
};

const EthBalance = ({ balance = "0" }: EthButtonPropType) => {
  return (
    <StyledEthBalance>
      <InfoHeading>{formatUnits(balance).substring(0, 5)} ETH</InfoHeading>
    </StyledEthBalance>
  );
};

export default EthBalance;
