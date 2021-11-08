import styled from "styled-components/macro";

import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";

const BorderedButton = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorderStyle}
`;

export default BorderedButton;
