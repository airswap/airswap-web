import styled from "styled-components/macro";

import SettingsButton from "../../components/SettingsButton/SettingsButton";
import breakPoints from "../../style/breakpoints";

const PopoverContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${breakPoints.phoneOnly} {
    flex-direction: row-reverse;
    position: relative;
  }
`;

export const StyledSettingsButton = styled(SettingsButton)`
  margin-right: 1rem;

  @media ${breakPoints.phoneOnly} {
    margin-right: 0;
    margin-left: 0.5rem;
  }
`;

export default PopoverContainer;
