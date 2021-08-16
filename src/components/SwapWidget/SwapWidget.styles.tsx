import styled from "styled-components/macro";

import Button from "../Button/Button";

export const Header = styled.div`
  margin-bottom: 1.875rem;
`;

export const QuoteAndTimer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const SubmitButton = styled(Button)`
  margin-bottom: 2.75rem;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 11.25rem;
  margin-top: -0.625rem;
`;

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
`;

export const StyledSwapWidget = styled.div``;

export default StyledSwapWidget;
