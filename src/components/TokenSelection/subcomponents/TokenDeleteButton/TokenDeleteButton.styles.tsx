import styled from "styled-components";

export const Text = styled.div`
  display: inline;
  margin-left: 0.25rem;
  font-size: 0.75rem;
`

export const StyledTokenDeleteButton = styled.button`
  position: relative;
  text-align: left;

  &:hover {
    
    ${Text} {
      text-decoration: underline;
    }
  }

  &:before {
    content: '•';
    display: inline;
  }
`;
