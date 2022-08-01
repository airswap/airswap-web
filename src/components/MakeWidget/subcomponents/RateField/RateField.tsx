import { useState } from "react";

import BigNumber from "bignumber.js";

import IconButton from "../../../IconButton/IconButton";
import { Text, Wrapper, RateBox } from "./RateField.styles";

function displayRate(rate: number) {
  if (rate > 1000000) {
    return ">1M";
  }

  if (rate < 0.05) {
    return "<0.1";
  }

  return rate.toFixed(1);
}

export type RateFieldProps = {
  token1: string;
  token2: string;
  rate: BigNumber;
  className: string;
};

export const RateField: React.FC<RateFieldProps> = ({
  token1,
  token2,
  rate,
  className,
}) => {
  const [TokenPair, setTokenPair] = useState([token1, token2]);
  const [CurrentRate, setCurrentRate] = useState(rate.toNumber());

  function handleClick() {
    setTokenPair([TokenPair[1], TokenPair[0]]);
    setCurrentRate(1 / CurrentRate);
  }

  return (
    <Wrapper className={className}>
      <Text>{` 1 ${TokenPair[0]} =`}</Text>
      <RateBox>{displayRate(CurrentRate)}</RateBox>
      <Text>{TokenPair[1]}</Text>
      <IconButton
        icon="swap-horizontal"
        iconSize={0.75}
        className="icon"
        onClick={handleClick}
      />
    </Wrapper>
  );
};
