import styled from "styled-components/macro";

export const Container = styled.div`
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.darkGrey};
  display: grid;
  grid-template-columns: 3rem auto 3rem;
  grid-gap: 1rem;
  padding: 1rem;
  align-items: center;
  width: 32rem;
  border-radius: 5px;
`;

type IconContainerProps = {
  error?: boolean;
};

export const IconContainer = styled.div<IconContainerProps>`
  background-color: ${(props) =>
    props.error ? "rgba(255,0,0,0.17);" : "rgba(96,255,102,0.1)"};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  color: white;
  color: ${(props) => (props.error ? "#FF0000" : "#60FF66")};
`;

export const HiXContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const TextContainer = styled.div`
  display: block;
`;
