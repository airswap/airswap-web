import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";

export const StyledWalletProviderList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${sizes.tradeContainerPadding};
  background: ${(props) => props.theme.colors.black};

  @media ${breakPoints.phoneOnly} {
    padding: 0 ${sizes.tradeContainerMobilePadding};
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.875rem;
`;
