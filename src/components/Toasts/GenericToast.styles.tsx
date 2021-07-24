import styled from "styled-components/macro";
import { ThemeProps } from "../../style/themes";

type ContainerProps = {
  intent: "error" | "warning";
};
export const Container = styled.div<{ theme: ThemeProps } & ContainerProps>`
  color: #fff;
  background: ${(props) =>
    props.intent === "error"
      ? props.theme.colors.red
      : props.theme.colors.orange};
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 1rem;
`;

export const InfoContainer = styled.div<{ theme: ThemeProps }>`
  display: grid;
  grid-template-columns: auto auto auto;
`;

export const HiXContainer = styled.div<{ theme: ThemeProps }>``;

export const TextContainer = styled.div<{ theme: ThemeProps }>`
  margin: 0 1rem;
  font-size: 1rem;
`;
