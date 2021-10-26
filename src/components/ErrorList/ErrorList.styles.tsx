import styled, { css } from "styled-components/macro";

import { sizes } from "../../style/sizes";

export const StyledErrorList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};
`;

export const StyledError = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 3rem;
  padding-top: 1.5rem;
  ${(props: any) =>
    props.idx === 0 &&
    css`
      border-top: 1px solid ${props.theme.colors.borderGrey};
    `}
`;

export const ErrorIconContainer = styled.div`
  display: flex;
  justify-content: left;
  position: relative;
  width: 3.75rem;
  height: 100%;
`;

export const ErrorTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 3.5rem);
`;
