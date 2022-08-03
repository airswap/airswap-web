import { css } from "styled-components";
import styled from "styled-components/macro";

import { InputOrButtonBorderStyleType2 } from "../../../../style/mixins";
import { fontMono } from "../../../../style/themes";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 2.5rem 5.125rem auto;
  width: 100%;
`;

const ButtonStyle = css`
  ${InputOrButtonBorderStyleType2};

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  font-family: ${fontMono};
  height: 2.5rem;
  text-transform: uppercase;
  background: none;

  & + a {
    margin-left: -1px;
  }

  &:hover,
  &:focus {
    z-index: 1;
    background: none;
  }
`;

export const GithubButton = styled.a`
  ${ButtonStyle};
  color: ${(props) => props.theme.colors.white};
`;

export const CommitButton = styled.a`
  ${ButtonStyle};
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.darkSubText};
`;
