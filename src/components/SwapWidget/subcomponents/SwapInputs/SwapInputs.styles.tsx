import styled from "styled-components/macro";

export const SwapIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  /* right: 3.75rem; */
  right: 14.125rem;
  margin-top: -1.5rem;
  transform: translateY(0.5rem);
  width: 1.5rem;
  height: 1.5rem;
  /* margin-top: -1rem; */
  /* margin-bottom: -0.875rem; */
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  background-color: ${(props) => props.theme.colors.black};
  font-size: 1rem;
  z-index: 1;
`;
