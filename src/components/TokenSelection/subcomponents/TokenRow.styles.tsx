import styled from "styled-components";

type ContainerProps = {
  disabled: boolean;
};

export const TokenName = styled.h3`
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.theme.colors.lightGrey)};
  line-height: 1rem;
`;

export const Container = styled.button<ContainerProps>`
  position: relative;
  width: 100%;
  padding: 0.5rem 0;
  display: grid;
  grid-auto-flow: column;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  grid-template-columns: 1.5rem 3.75rem 3fr 3fr;
  grid-gap: 1rem;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};

  &:hover {
    ${TokenName} {
      color: ${(props) => (props.theme.colors.white)};
    }
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
`;

export const Image = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Symbol = styled.h3`
  
  text-align: left;
  font-size: ${(props) => (props.theme.typography.formInput.fontSize)};
  font-weight: ${(props) => (props.theme.typography.formInput.fontWeight)};
  line-height: ${(props) => (props.theme.typography.formInput.lineHeight)};
`;

export const Balance = styled.div`
  text-align: right;
`;

export const TokenDeleteButton = styled.button`
  position: relative;
  text-align: left;
  text-indent: 1rem;

  &:hover {
    text-decoration: underline;
  }
  
  &:before {
    content: '•';
    display: block;
  }
`;
