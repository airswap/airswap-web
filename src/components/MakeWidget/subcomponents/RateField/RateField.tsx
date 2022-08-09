import { useState, useMemo } from "react";

import BigNumber from "bignumber.js";

import IconButton from "../../../IconButton/IconButton";
import { Text, Wrapper, RateBox } from "./RateField.styles";
import { customStringToSignificantDecimals } from "./helpers/customStringToSignificantDecimals";

export type RateFieldProps = {
  token1: string;
  token2: string;
  rate: BigNumber;
  active: boolean;
  className?: string;
};

export const RateField: React.FC<RateFieldProps> = ({
  token1,
  token2,
  rate,
  active,
  className,
}) => {
  const [tokenPair, setTokenPair] = useState([token1, token2]);
  const [currentRate, setCurrentRate] = useState(rate);

  const displayRate = useMemo(
    () => customStringToSignificantDecimals(currentRate.toString(), 1, 7),
    [currentRate]
  );

  function handleClick() {
    setTokenPair([tokenPair[1], tokenPair[0]]);
    setCurrentRate(new BigNumber("1").div(currentRate));
  }

  return (
    <Wrapper className={`${className} ${active ? "active" : ""}`}>
      <Text>{` 1 ${tokenPair[0]} =`}</Text>
      <RateBox>{displayRate}</RateBox>
      <Text>{tokenPair[1]}</Text>
      <IconButton
        icon="swap-horizontal"
        iconSize={0.75}
        className="icon"
        onClick={handleClick}
      />
    </Wrapper>
  );
};
