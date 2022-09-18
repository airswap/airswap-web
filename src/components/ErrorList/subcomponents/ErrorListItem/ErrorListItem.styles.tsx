import styled from "styled-components/macro";

import Icon from "../../../Icon/Icon";
import { SubText } from "../../../Typography/Typography";

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3rem;
  margin-top: 1.5rem;
`;

export const ErrorTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 3.75rem);
`;

export const StyledErrorIcon = styled(Icon)`
  margin-right: 1.125rem;

  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const StyledSubText = styled(SubText)`
  color: ${(props) => props.theme.colors.lightGrey};
`;
