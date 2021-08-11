import styled from "styled-components/macro";

export const Text = styled.div`
  display: inline;
  margin-left: 0.25rem;
  font-size: 0.75rem;
`;

export const Container = styled.button`
  position: relative;
  text-align: left;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    ${Text} {
      text-decoration: underline;
    }
  }

  &:before {
    content: "•";
    display: inline;
  }
`;
