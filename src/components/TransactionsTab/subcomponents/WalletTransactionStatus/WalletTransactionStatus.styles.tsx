import styled from "styled-components/macro";

import Icon from "../../../Icon/Icon";

export const IconContainer = styled.div`
  width: 1.75rem;
`;

export const SucceedIcon = styled(Icon)`
  transform: translate(-0.25rem, -0.25rem);
`;

export const ProcessingIcon = styled(Icon)`
  transform: translate(-0.125rem, 0.0625rem);
`;

export const FailedIcon = styled(Icon)`
  transform: translate(-0.125rem, 0);
`;
