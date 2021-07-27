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
  color: #9E9E9E;
  padding: 1rem;
  font-size: 0.75rem;
  margin: 1rem 0;
`;

type TokenContainerProps = {
    listLength: number;
}

export const TokenContainer = styled.div<TokenContainerProps>`
    border: 1px solid #282828;
    linear-gradient(91.88deg, rgba(21, 22, 25, 0.64) 0%, rgba(21, 22, 25, 0.24) 100%);
    max-height: 286px;
    overflow-y: ${props => props.listLength > 5 ? "scroll" : "none"};
    &::-webkit-scrollbar { 
        width: 0.5rem;
        background: #151619;
    }

    &::-webkit-scrollbar-thumb {
        background: #f1f1f1;
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
