import { formatUnits } from "ethers/lib/utils";

import BorderedButton from "../../styled-components/BorderedButton/BorderedButton";
import { InfoHeading } from "../Typography/Typography";

type EthButtonPropType = {
  balance: string;
};

const EthButton = ({ balance = "0" }: EthButtonPropType) => {
  return (
    <BorderedButton>
      <InfoHeading>{formatUnits(balance).substring(0, 5)} ETH</InfoHeading>
    </BorderedButton>
  );
};

export default EthButton;
