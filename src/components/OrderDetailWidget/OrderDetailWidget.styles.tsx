import styled from "styled-components/macro";

import ActionButtons from "./subcomponents/ActionButtons/ActionButtons";
import InfoButtons from "./subcomponents/InfoButtons/InfoButtons";
import InfoSection from "./subcomponents/InfoSection/InfoSection";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
`;

export const StyledInfoButtons = styled(InfoButtons)`
  flex-grow: 1;
`;

export const StyledActionButtons = styled(ActionButtons)``;

export const StyledInfoSection = styled(InfoSection)`
  flex-grow: 1;

  & + ${StyledActionButtons} {
    margin-top: 1rem;
  }
`;
