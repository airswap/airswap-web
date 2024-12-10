import styled from "styled-components/macro";

import { TextEllipsis } from "../../style/mixins";
import { fontMono } from "../../style/themes";

export const ReviewListItem = styled.li`
  display: flex;
  justify-content: space-between;

  & + & {
    margin-top: 0.625rem;
  }
`;

export const ReviewListItemLabel = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const ReviewListItemValue = styled.div`
  ${TextEllipsis};

  display: flex;
  align-items: center;
  font-family: ${fontMono};
  color: ${(props) => props.theme.colors.white};
`;
