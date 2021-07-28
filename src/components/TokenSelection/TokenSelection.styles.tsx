import styled from "styled-components";

export const Container = styled.div`
  background-color: ${(props) => props.theme.colors.black};
  padding: 2rem;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 2rem;
`;

export const ArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  cursor: pointer;
`;

export const StyledLabel = styled.label`
  font-size: 1rem;
`;

export const StyledInput = styled.input`
  border: 1px solid #282828;
  border-radius: 500px;
  background: transparent;
  color: #9e9e9e;
  padding: 1rem;
  font-size: 0.75rem;
  margin: 1rem 0;
  width: 100%;
  &:focus {
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.primary};
  }
`;

type TokenContainerProps = {
  listLength: number;
};

export const TokenContainer = styled.div<TokenContainerProps>`
  border: 1px solid #282828;
  max-height: 286px;
  overflow-y: ${(props) => (props.listLength > 4 ? "scroll" : "hidden")};
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0.5rem;
    background: ${(props) => props.theme.colors.black};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.white};
    border-radius: 0.5rem;
  }
`;

export const InactiveTitleContainer = styled.div`
  border: 1px solid #282828;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InactiveTitle = styled.h3`
  font-size: 0.75rem;
`;
