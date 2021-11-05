import styled from "styled-components";

import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";

const BorderedButton = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}
`;

export default BorderedButton;
