import Icon from "../../../Icon/Icon";
import { Text, Wrapper, RateBox, Button } from "./RateField.styles";

export type RateFieldProps = {
  TokenPair: string[];
  Rate: number;
  onChange: (TokenPair: string[]) => void;
};

export const RateField: React.FC<RateFieldProps> = ({
  TokenPair,
  Rate,
  onChange,
}) => {
  function handleChange() {
    onChange([TokenPair[1], TokenPair[0]]);
  }

  return (
    <Wrapper>
      <Text>{` 1 ${TokenPair[0]} =`}</Text>
      <RateBox>{Rate.toFixed(1)}</RateBox>
      <Text>{TokenPair[1]}</Text>
      <Button onClick={() => handleChange()}>
        <Icon name={"swap-horizontal"} iconSize={0.75} className={"icon"} />
      </Button>
    </Wrapper>
  );
};
