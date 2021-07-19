import styled from "styled-components/macro";

export const Container = styled.div`
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.black};
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 1rem;
  padding: 1rem;
  justify-items: center;
  align-items: center;
`;

type IconContainerProps = {
  error?: boolean;
};

export const IconContainer = styled.div<IconContainerProps>`
  background: ${(props) =>
    props.error ? props.theme.colors.red : props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  color: white;
`;

export const HiXContainer = styled.div`
  height: 100%;
`;

export const TextContainer = styled.div`
  font-weight: 700;
`;
