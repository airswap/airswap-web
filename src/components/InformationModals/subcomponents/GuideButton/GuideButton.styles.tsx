import styled from "styled-components/macro";

import Icon from "../../../Icon/Icon";

export const StyledIcon = styled(Icon)`
  margin-bottom: 0.375rem;
  color: ${(props) => props.theme.colors.darkSubText};
`;

export const Text = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 2;
  color: ${(props) => props.theme.colors.darkSubText};
`;

export const GuideButtonContainer = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  padding: 1rem;
  width: 25%;
  height: 6.625rem;
  overflow: hidden;

  &:not(&:last-of-type):not(:focus) {
    border-right: 0;
  }

  &:first-of-type {
    border-top-left-radius: 0.1875rem;
    border-bottom-left-radius: 0.1875rem;
  }

  &:last-of-type {
    border-top-right-radius: 0.1875rem;
    border-bottom-right-radius: 0.1875rem;
  }

  &:focus {
    outline: 0;
    border: 1px solid ${(props) => props.theme.colors.lightGrey};
    z-index: 1;

    & + & {
      border-left: 0;
    }

    &:not(:last-of-type) {
      padding-right: calc(1rem - 1px);
    }
  }

  &:hover {
    ${StyledIcon} {
      color: ${(props) => props.theme.colors.white};
    }

    ${Text} {
      color: ${(props) => props.theme.colors.white};
    }
  }
`;
