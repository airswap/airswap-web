import styled from "styled-components/macro";

import InfoButtons from "./subcomponents/InfoButtons/InfoButtons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const StyledInfoButtons = styled(InfoButtons)`
  flex-grow: 1;
`;
