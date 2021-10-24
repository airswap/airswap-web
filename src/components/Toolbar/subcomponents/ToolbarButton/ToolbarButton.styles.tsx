import styled from "styled-components/macro";

export const ToolbarButtonContainer = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  width: 5rem;
  height: 5rem;

  & + & {
    margin-top: 1rem;
  }

  &:hover,
  &:focus {
    border-color: ${(props) => props.theme.colors.white};
    outline: 0;
  }
`;

export const Text = styled.div`
  margin-top: 0.25rem;
  font-weight: 600;
  font-size: 0.6875rem;
  text-transform: uppercase;
`;
