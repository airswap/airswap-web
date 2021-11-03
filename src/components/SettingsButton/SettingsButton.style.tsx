import styled from "styled-components";

import IconButton from "../IconButton/IconButton";

export const SettingIconButtonContainer = styled.div`
  border: 1px solid ${(props) => props.theme.colors.darkGrey};
  border-radius: 50%;
  padding: 0.5rem;
  transition: border-color ease-out 0.3s;

  &:hover,
  &:focus {
    border-color: ${(props) => props.theme.colors.white};
  }
`;

export const SettingsIconButton = styled(IconButton)`
  &:focus {
    outline: none;
  }
`;
