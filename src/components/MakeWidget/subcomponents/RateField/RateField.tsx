import { useState, useMemo, useEffect } from "react";

import BigNumber from "bignumber.js";

import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import Icon from "../../../Icon/Icon";
import {
  Text,
  Wrapper,
  StyledIconButton,
  RateBox,
  Equals,
} from "./RateField.styles";

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
  const [invertPair, setInvertPair] = useState(false);
  const [currentRate, setCurrentRate] = useState(rate);

  const displayRate = useMemo(
    () => stringToSignificantDecimals(currentRate.toString(), 4, 7),
    [currentRate]
  );

  useEffect(() => {
    setCurrentRate(rate);
  }, [rate]);

  useEffect(() => {
    setInvertPair(false);
  }, [token1, token2, rate]);

  function handleClick() {
    const newInvertState = !invertPair;
    setInvertPair(newInvertState);
    setCurrentRate(new BigNumber("1").div(currentRate));
  }

  return (
    <Wrapper
      as={isButton ? "button" : "div"}
      onClick={isButton ? handleClick : undefined}
      isButton={isButton}
      className={className}
    >
      1<Text>{invertPair ? token2 : token1}</Text>
      <Equals>=</Equals>
      <RateBox>{displayRate}</RateBox>
      <Text>{invertPair ? token1 : token2}</Text>
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
