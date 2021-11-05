import styled from "styled-components";

import { BorderedPill, InputOrButtonBorder } from "../../style/mixins";

const BorderedButton = styled.button`
  ${BorderedPill}
  ${InputOrButtonBorder}
`;

export default BorderedButton;
