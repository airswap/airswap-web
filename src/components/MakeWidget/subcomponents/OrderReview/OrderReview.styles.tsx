import styled from "styled-components/macro";

import breakPoints from "../../../../style/breakpoints";
import {
  BorderlessButtonStyle,
  InputOrButtonBorderStyleType2,
} from "../../../../style/mixins";
import IconButton from "../../../IconButton/IconButton";
import OrderReviewToken from "../OrderReviewToken/OrderReviewToken";

export const Container = styled.div``;

export const StyledOrderReviewToken = styled(OrderReviewToken)`
  border-bottom: 1px solid ${(props) => props.theme.colors.borderGrey};
`;

export const ReviewList = styled.ul`
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;

  @media ${breakPoints.phoneOnly} {
    font-size: 0.9375rem;
  }
`;

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
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.white};
`;

export const StyledIconButton = styled(IconButton)`
  ${BorderlessButtonStyle};

  margin-top: 0.1875rem;
  padding: 0;

  &:hover,
  &:active {
    color: ${(props) => props.theme.colors.white};
  }
`;
