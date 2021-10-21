import styled from "styled-components";

import IconButton from "../IconButton/IconButton";

const SettingIconButtonContainer = styled.div``;

const SettingsIconButton = styled(IconButton)`
  &:hover {
    opacity: 0.75;
  }

  &:focus {
    outline: none;
  }
`;

export { SettingIconButtonContainer, SettingsIconButton };
