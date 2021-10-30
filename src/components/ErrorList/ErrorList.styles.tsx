import styled, { css } from "styled-components/macro";

import { sizes } from "../../style/sizes";
import Button from "../Button/Button";

export const StyledErrorList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};
`;

export const StyledError = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 3rem;
  margin-top: 1.5rem;
`;

export const ErrorIconContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 0.3rem;
  position: relative;
  width: 3.75rem;
  height: 100%;
  path {
    fill: ${(props) =>
      props.theme.name === "light"
        ? props.theme.colors.primary
        : props.theme.colors.alwaysWhite};
  }
`;

export const ErrorTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 3.75rem);
`;

export const BackButton = styled(Button)`
  width: calc(100% - 3.75rem);
  align-self: center;
  border: 1px solid
    ${(props) =>
      props.theme.name === "light"
        ? props.theme.colors.lightGrey
        : props.theme.colors.borderGrey};
  background-color: transparent;
  &:hover {
    background: ${(props) =>
      props.theme.name === "light"
        ? props.theme.colors.primary
        : props.theme.colors.alwaysBlack};
    color: ${(props) => props.theme.colors.alwaysWhite};
  }
`;
