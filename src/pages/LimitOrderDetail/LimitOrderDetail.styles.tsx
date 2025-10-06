import styled from "styled-components";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

export const StyledLoadingSpinner = styled(LoadingSpinner)`
  flex-grow: 1;

  svg {
    width: 2rem;
    height: 2rem;
  }
`;
