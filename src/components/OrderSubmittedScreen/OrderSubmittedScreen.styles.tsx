import styled, { css } from "styled-components/macro";

import {
  OverlaySubHeading,
  OverlayTitle,
} from "../../styled-components/Overlay/Overlay";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  padding-bottom: 2rem;
`;

export const StyledOverlayTitle = styled(OverlayTitle)`
  margin-top: 1.75rem;

  & + ${OverlaySubHeading} {
    margin-top: 1.25rem;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  width: 3.6875rem;
  height: 3.6875rem;
`;

export const StyledIcon = styled(Icon)`
  width: 100%;
  height: 100%;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 2rem;
`;

const ButtonStyle = css`
  width: fit-content;
  padding-inline: 3.5rem;
`;

export const MakeNewOrderButton = styled(Button)`
  ${ButtonStyle};
`;
export const TrackTransactionButton = styled(Button)`
  ${ButtonStyle};
`;
