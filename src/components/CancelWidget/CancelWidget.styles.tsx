import styled from "styled-components/macro";

import { InputOrButtonBorderStyle } from "../../style/mixins";
import Button from "../Button/Button";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";

export const Header = styled.div`
  justify-self: flex-start;
  margin-bottom: auto;
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const StyledInfoHeading = styled(InfoHeading)`
  margin-top: 2rem;

  & + ${InfoSubHeading} {
    margin-top: 0.25rem;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  justify-self: flex-end;
  margin-top: auto;
`;

export const BackButton = styled(Button)`
  ${InputOrButtonBorderStyle};

  width: calc(50% - 0.5rem);
`;

export const CancelButton = styled(Button)`
  width: calc(50% - 0.5rem);
`;
