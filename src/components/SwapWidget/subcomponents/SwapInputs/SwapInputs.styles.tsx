import styled from "styled-components/macro";

export const SwapIconContainer = styled.div`
  position: absolute;
  /* right: 3.75rem; */
  right: 14.125rem;
  top: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  /* margin-top: -1rem; */
  /* margin-bottom: -0.875rem; */
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  background-color: ${(props) => props.theme.colors.black};
  font-size: 1.25rem;
  z-index: 1;
`;
