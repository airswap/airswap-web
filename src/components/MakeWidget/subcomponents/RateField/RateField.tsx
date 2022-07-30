import { useState } from "react";

import BigNumber from "bignumber.js";

import Icon from "../../../Icon/Icon";
import IconButton from "../../../IconButton/IconButton";
import { Text, Wrapper, RateBox, Button } from "./RateField.styles";

export type RateFieldProps = {
  Token1: string;
  Token2: string;
  Rate: BigNumber;
  ClassName: string;
};

export const RateField: React.FC<RateFieldProps> = ({
  Token1,
  Token2,
  Rate,
  ClassName,
}) => {
  const [TokenPair, setTokenPair] = useState([Token1, Token2]);
  const [RelRate, setRelRate] = useState(Rate.toNumber());

  function handleChange() {
    setTokenPair([TokenPair[1], TokenPair[0]]);
    setRelRate(1 / RelRate);
  }

  return (
    <Wrapper className={ClassName}>
      <Text>{` 1 ${TokenPair[0]} =`}</Text>
      <RateBox>{RelRate.toFixed(1)}</RateBox>
      <Text>{TokenPair[1]}</Text>
      <IconButton
        icon="swap-horizontal"
        iconSize={0.75}
        className="icon"
        onClick={handleChange}
      />
    </Wrapper>
  );
};
