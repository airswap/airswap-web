import Icon from "../../../Icon/Icon";
import { Text, Wrapper, RateBox } from "./RateField.styles";

export type RateFieldProps = {
  TokenPair: string[];
  Rate: string;
};

export const RateField: React.FC<RateFieldProps> = ({ TokenPair, Rate }) => {
  return (
    <Wrapper>
      <Text>{` 1 ${TokenPair[0]} =`}</Text>
      <RateBox>{Rate}</RateBox>
      <Text>{TokenPair[1]}</Text>
      <Icon name={"swap-horizontal"} iconSize={0.75} className={"icon"} />
    </Wrapper>
  );
};
