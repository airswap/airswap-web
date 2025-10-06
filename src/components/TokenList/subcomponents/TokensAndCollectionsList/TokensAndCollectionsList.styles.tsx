import styled from "styled-components";

import isActiveLanguageLogographic from "../../../../helpers/isActiveLanguageLogographic";
import { fontWide } from "../../../../style/themes";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { SpinningIcon } from "../../../LoadingSpinner/LoadingSpinner.styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TokensScrollContainer = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  min-height: 10rem;
`;

export const TokensContainer = styled.div``;

export const TokenListLoader = styled(LoadingSpinner)`
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(props) => props.theme.colors.darkBlue};
    opacity: 0.35;
  }

  position: absolute;
  inset: 0;

  ${SpinningIcon} {
    width: 2rem;
    height: 2rem;
  }
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 1.5rem;
  margin-block-start: 2rem;
`;

export const LegendItem = styled.div`
  word-break: keep-all;
  font-family: ${fontWide};
  font-weight: 500;
  font-size: ${() => (isActiveLanguageLogographic() ? "0.875rem" : "1rem")};
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const NoResultsContainer = styled.div`
  margin-block-start: 1rem;
  text-align: center;
`;
