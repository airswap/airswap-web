import styled from "styled-components/macro";

import { FlexAlignCenter, TextEllipsis } from "../../style/mixins";
import Icon from "../Icon/Icon";

export const CheckLabel = styled.label<{ isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${({ isDisabled }) =>
    isDisabled &&
    `
     pointer-events: none;
     opacity: 0.5;
  `}
`;

export const CheckContainer = styled.div`
  ${FlexAlignCenter};

  border: 1px solid ${(props) => props.theme.colors.lightGrey};
  border-radius: 2px;
  width: 1.5rem;
  height: 1.5rem;
`;

export const CheckIcon = styled(Icon)`
  display: none;
`;

export const LabelContainer = styled.div`
  margin-left: 1rem;
  width: calc(100% - 2.5rem);
`;

export const Label = styled.div`
  ${TextEllipsis};

  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const SubLabel = styled.div`
  ${TextEllipsis};

  margin-top: -0.125rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: ${(props) => props.theme.colors.darkSubText};
`;

export const Input = styled.input`
  position: absolute;
  opacity: 0;

  &:checked {
    & ~ ${CheckContainer} {
      border-color: ${(props) => props.theme.colors.primary};
      background: ${(props) => props.theme.colors.primary};
    }

    & ~ ${CheckContainer} ${CheckIcon} {
      display: block;
    }
  }

  &:disabled ~ ${CheckContainer} {
    border-color: ${(props) => props.theme.colors.grey};
    background: ${(props) => props.theme.colors.grey};
  }
`;
