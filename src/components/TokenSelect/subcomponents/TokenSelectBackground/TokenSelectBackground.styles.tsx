import styled from "styled-components/macro";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  background: ${(props) =>
    props.theme.name === "dark"
      ? "linear-gradient(90deg, #111D34 0%, #142445 100%)"
      : props.theme.colors.primaryLight};
`;

export const GradientBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  opacity: 0;
  transition: opacity 0.25s ease-out;
`;

export const TokenSelectLeftGradientBackground = styled(GradientBackground)`
  background: linear-gradient(90deg, #2b71ff -125%, #142445 50%);
`;
export const TokenSelectRightGradientBackground = styled(GradientBackground)`
  background: linear-gradient(270deg, #2b71ff -125%, #142445 50%);
`;

export const BorderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
  margin: -1px;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.borderGrey};
  background-clip: padding-box;
  transition: opacity 0.25s ease-out;
`;

export const TokenSelectLeftBorderBackground = styled(BorderBackground)`
  z-index: -1;
  opacity: 0;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary} -25%,
    ${({ theme }) => theme.colors.borderGrey} 75%
  );
`;

export const TokenSelectrightBorderBackground = styled(BorderBackground)`
  z-index: -1;
  opacity: 0;
  background: linear-gradient(270deg, #2b71ff -125%, #142445 50%);
`;

// background: linear-gradient(${(props) =>
//   props.position === "left" ? "90deg" : "270deg"}, ${({ theme }) => theme.colors.borderGrey} -25%, #142445 75%);
// }
