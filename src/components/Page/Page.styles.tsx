import styled from "styled-components/macro";

import SiteLogo from "../SiteLogo/SiteLogo";
import { StyledPageProps } from "./Page";

export const StyledSiteLogo = styled(SiteLogo)`
  position: absolute;
  top: 2.5rem;
  top: ${(props) => (props.adjustForBookmarkWarning ? "1.2rem" : "2.5rem")};
  left: 2.5rem;
`;

export const StyledPage = styled.div<StyledPageProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 18rem;
  min-height: ${(props) =>
    props.adjustForBookmarkWarning ? "calc(100vh - 40px)" : "100vh"};
  padding: 2rem 0;

  @media (min-height: 50rem) {
    align-items: center;
    height: ${(props) =>
      props.adjustForBookmarkWarning ? "calc(100vh - 40px)" : "100vh"};
    min-height: 50rem;
  }
`;
