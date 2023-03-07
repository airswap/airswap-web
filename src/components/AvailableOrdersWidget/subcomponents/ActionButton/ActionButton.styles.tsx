import styled from "styled-components";

import { InputOrButtonBorderStyle } from "../../../../style/mixins";
import Button from "../../../Button/Button";

export const CreateSwapButton = styled(Button)`
  ${InputOrButtonBorderStyle}
  margin-bottom: 2rem;
`;
