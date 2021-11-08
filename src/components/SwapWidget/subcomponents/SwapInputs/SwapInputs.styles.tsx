import styled from "styled-components/macro";

export const Container = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  opacity: ${(props) => (props.$disabled ? 0.4 : 1)};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "inherit")};
  will-change: opacity;
  transition: ease-in-out;
  transition-duration: 300ms;
`;

export const SwapIconContainer = styled.div`
  position: absolute;
  right: 14.125rem;
  top: 9.9375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 50%;
  color: ${(props) => props.theme.colors.lightGrey};
  background-color: ${(props) => props.theme.colors.black};
  font-size: 1.25rem;
  z-index: 1;
`;
