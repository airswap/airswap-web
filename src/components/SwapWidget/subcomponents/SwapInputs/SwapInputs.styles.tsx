import styled from "styled-components/macro";

export const Container = styled.div<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "inherit")};
  will-change: opacity, transform;
  transition: opacity 0.3s ease-in-out,
    transform 0.4s cubic-bezier(0.45, 0.22, 0, 1);
  transform: scale(${(props) => (props.$disabled ? 0.95 : 1)});

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;

export const SwapIconContainer = styled.div`
  position: absolute;
  right: calc(50% - 0.75rem);
  top: calc(50% - 0.75rem);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 50%;
  color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.lightGrey
      : props.theme.colors.darkGrey};
  background-color: ${(props) => props.theme.colors.black};
  font-size: 1.25rem;
  z-index: 1;
`;
