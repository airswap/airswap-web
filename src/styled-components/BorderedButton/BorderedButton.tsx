import styled from "styled-components";

const BorderedButton = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid ${(props) => props.theme.colors.darkGrey};
  border-radius: 24rem;
  transition: border-color ease-out 0.3s;

  &:hover {
    border-color: ${(props) => props.theme.colors.white};
  }
`;

export default BorderedButton;
