import styled from "styled-components/macro";

import Button from "../../../Button/Button";

type ClearCustomServerButtonProps = {
  hasServerUrl: boolean;
};

export const ClearServerButtonText = styled.span`
  color: gray;
  font-size: 0.75rem;
`;

export const ClearCustomServerButton = styled(
  Button
)<ClearCustomServerButtonProps>`
  display: ${(props) => (props.hasServerUrl ? "flex" : "none")};
  margin-top: 1rem;
  width: fit-content;
`;
