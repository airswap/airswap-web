import styled from "styled-components/macro";

import {
  BorderedPill,
  InputOrButtonBorderStyle,
} from "../../../../style/mixins";

export const ClearCustomServerButton = styled.button`
  ${BorderedPill};
  ${InputOrButtonBorderStyle};

  font-size: 1rem;
  margin-top: 1rem;
  width: fit-content;
`;
