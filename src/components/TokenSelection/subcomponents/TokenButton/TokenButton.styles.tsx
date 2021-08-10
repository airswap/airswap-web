import styled from "styled-components/macro";

type ContainerProps = {
  disabled: boolean;
};

export const TokenNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

export const TokenName = styled.h3`
  width: 100%;
  text-align: left;
  line-height: 1;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const Container = styled.button<ContainerProps>`
  position: relative;
  width: 100%;
  padding: 0.5rem 0;
  display: grid;
  grid-auto-flow: column;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  grid-template-columns: 1.5rem 4rem calc(50% - 4rem) calc(50% - 4.5rem);
  grid-gap: 1rem;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    ${TokenName} {
      color: ${(props) =>
        props.disabled
          ? props.theme.colors.lightGrey
          : props.theme.colors.white};
    }
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
`;

export const Image = styled.img``;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Symbol = styled.h3`
  text-align: left;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: calc(1 + (1 / 3));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Balance = styled.div`
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
