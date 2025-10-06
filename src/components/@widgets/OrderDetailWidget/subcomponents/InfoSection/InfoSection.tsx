import { FC, useMemo } from "react";

import BigNumber from "bignumber.js";

import { PriceConverter } from "../../../../PriceConverter/PriceConverter";
import { InfoSubHeading } from "../../../../Typography/Typography";
import { Container } from "./InfoSection.styles";
import { getOrderDetailWarningTranslation } from "./helpers";

type ActionButtonsProps = {
  isAllowancesFailed: boolean;
  isDifferentChainId: boolean;
  isExpired: boolean;
  isIntendedRecipient: boolean;
  isMakerOfSwap: boolean;
  isNotConnected: boolean;
  orderChainId: number;
  token1?: string;
  token2?: string;
  rate: BigNumber;
  onFeeButtonClick: () => void;
  className?: string;
};

const InfoSection: FC<ActionButtonsProps> = ({
  isAllowancesFailed,
  isDifferentChainId,
  isExpired,
  isIntendedRecipient,
  isMakerOfSwap,
  isNotConnected,
  orderChainId,
  token1,
  token2,
  rate,
  className,
}) => {
  const warningText = useMemo(() => {
    return getOrderDetailWarningTranslation(
      isAllowancesFailed,
      isDifferentChainId,
      isExpired,
      isIntendedRecipient,
      isMakerOfSwap,
      isNotConnected,
      orderChainId
    );
  }, [
    isDifferentChainId,
    isExpired,
    isIntendedRecipient,
    isMakerOfSwap,
    isNotConnected,
    orderChainId,
  ]);

  if (warningText) {
    return (
      <Container className={className}>
        <InfoSubHeading>{warningText.heading}</InfoSubHeading>
      </Container>
    );
  }

  if (token1 && token2 && rate) {
    return (
      <Container className={className}>
        <PriceConverter
          baseTokenSymbol={token1}
          quoteTokenSymbol={token2}
          price={rate}
        />
      </Container>
    );
  }

  return <Container className={className} />;
};

export default InfoSection;
