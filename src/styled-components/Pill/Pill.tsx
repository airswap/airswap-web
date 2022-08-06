import styled from "styled-components";
import { css } from "styled-components/macro";

export const PillStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 0 1rem;
  height: 2rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.lightGrey : theme.colors.primary};
`;

export const Pill = styled.div`
  ${PillStyle};
`;
