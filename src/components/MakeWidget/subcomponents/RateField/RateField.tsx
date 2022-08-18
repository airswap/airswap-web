import { useState, useMemo } from "react";

import BigNumber from "bignumber.js";

import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import Icon from "../../../Icon/Icon";
import { Text, Wrapper, StyledIconButton, RateBox } from "./RateField.styles";

export type RateFieldProps = {
  isButton?: boolean;
  token1: string;
  token2: string;
  rate: BigNumber;
  className?: string;
};

export const RateField: React.FC<RateFieldProps> = ({
  isButton = false,
  token1,
  token2,
  rate,
  className,
}) => {
  const [tokenPair, setTokenPair] = useState([token1, token2]);
  const [currentRate, setCurrentRate] = useState(rate);

  const displayRate = useMemo(
    () => stringToSignificantDecimals(currentRate.toString(), 4, 7),
    [currentRate]
  );

  function handleClick() {
    setTokenPair([tokenPair[1], tokenPair[0]]);
    setCurrentRate(new BigNumber("1").div(currentRate));
  }

  return (
    <Wrapper
      as={isButton ? "button" : "div"}
      onClick={isButton ? handleClick : undefined}
      isButton={isButton}
      className={className}
    >
      <Text>{` 1 ${tokenPair[0]} =`}</Text>
      <RateBox>{displayRate}</RateBox>
      <Text>{tokenPair[1]}</Text>
      {isButton ? (
        <Icon name="swap-horizontal" iconSize={0.75} />
      ) : (
        <StyledIconButton
          icon="swap-horizontal"
          iconSize={0.75}
          onClick={handleClick}
        />
      )}
    </Wrapper>
  );
};
