import { TokenInfo } from "@airswap/typescript";
import { Story, Meta } from "@storybook/react";

import styled from "styled-components/macro";

import { Subtitle } from "../Typography/Typography";
import TokenLogo from "./TokenLogo";

export default {
  title: "components/TokenLogo",
  component: TokenLogo,
} as Meta;

const Grid = styled.div`
  margin: 1rem;
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  row-gap: 2rem;
  column-gap: 5rem;
`;

const airSwapTokenInfo: TokenInfo = {
  symbol: "AST",
  address: "0x27054b13b1b798b345b591a4d22e6562d47ea75a",
  chainId: 1,
  decimals: 4,
  logoURI:
    "https://assets.coingecko.com/coins/images/1019/thumb/AST.png?1547034939",
  name: "AirSwap",
};

const Template: Story<{}> = (args) => (
  <Grid>
    <Subtitle>small</Subtitle>
    <TokenLogo tokenInfo={airSwapTokenInfo} size="small" />
    <Subtitle>medium</Subtitle>
    <TokenLogo tokenInfo={airSwapTokenInfo} size="medium" />
    <Subtitle>large</Subtitle>
    <TokenLogo tokenInfo={airSwapTokenInfo} size="large" />
    <Subtitle>Empty (medium)</Subtitle>
    <TokenLogo tokenInfo={null} size="medium" />
  </Grid>
);

export const AirSwap = Template.bind({});
AirSwap.args = {
  children: "Click me",
  intent: "primary",
};
