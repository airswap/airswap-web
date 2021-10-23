import styled from "styled-components/macro";

// Notice we are overriding background-color with !important
// this is necessary to override built-in styling of toasts
export const Container = styled.div`
  display: grid;
  grid-template-columns: 2.5rem auto 2.5rem;
  grid-gap: 1rem;
  align-items: center;
  width: 22.5rem;
  border-radius: 0.5rem;
  padding: 0.625rem;
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.darkGrey} !important;
`;

type IconContainerProps = {
  error?: boolean;
};

// Notice we are overriding background and border-radius with !important
// this is necessary to override built-in styling of toasts
export const IconContainer = styled.div<IconContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${(props) =>
    props.error ? "rgba(255,0,0,0.17)" : "rgba(96,255,102,0.1)"} !important;
  border-radius: 50% !important;
  color: white;
  color: ${(props) => (props.error ? "#FF0000" : "#60FF66")};
`;

export const HiXContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const TextContainer = styled.div`
  display: block;
`;
