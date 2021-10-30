import styled, { css } from "styled-components/macro";

const ButtonStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  width: 5rem;
  height: 5rem;

  & + a,
  & + button {
    margin-top: 1rem;
  }

  &:hover,
  &:focus {
    border-color: ${(props) => props.theme.colors.lightGrey};
    outline: 0;
  }
`;

export const ToolbarButtonContainer = styled.button`
  ${ButtonStyle}
`;

export const ToolBarAnchorContainer = styled.a`
  ${ButtonStyle}
`;

export const Text = styled.div`
  margin-top: 0.25rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
`;
