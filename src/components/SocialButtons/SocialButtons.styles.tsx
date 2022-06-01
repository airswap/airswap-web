import styled from "styled-components/macro";

import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import Icon from "../Icon/Icon";
import { Link } from "../Typography/Typography";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 0.5rem;
  position: relative;
  height: 2.5rem;
  z-index: 1;
`;

export const Divider = styled.div`
  height: 1px;
  width: 1rem;
  background-color: ${(props) => props.theme.colors.borderGrey};
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

export const PlainLink = styled(Link)<{ $deEmphasize: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  line-height: 1;
  height: 2.25rem;
  width: 2.25rem;
  opacity: ${({ $deEmphasize }) => ($deEmphasize ? 0.5 : 1)};
`;

export const SocialButton = styled.div<{ showLocales?: number }>`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 2.5rem;
  height: ${({ showLocales = 0 }) =>
    (1 + showLocales) * 2.5 + "rem"} !important;
  &:hover {
    background-color: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.black : theme.colors.primary};
  }
`;

export const StyledIcon = styled(Icon)<{ $deEmphasize: boolean }>`
  padding: calc(1rem / 1.5);
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ $deEmphasize }) => ($deEmphasize ? 0.5 : 1)};
`;
