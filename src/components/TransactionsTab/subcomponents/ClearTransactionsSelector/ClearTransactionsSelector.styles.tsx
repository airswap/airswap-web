import styled from "styled-components/macro";

import { Tooltip } from "../../../../styled-components/Tooltip/Tooltip";
import Dropdown from "../../../Dropdown/Dropdown";
import IconButton from "../../../IconButton/IconButton";

export const Container = styled.div`
  position: relative;
`;

export const StyledDropdown = styled(Dropdown)`
  position: absolute;
  top: 2.125rem;
  right: 2.125rem;
  min-width: 5rem;
  z-index: 1;
`;

export const ClearListButtonTooltip = styled(Tooltip)`
  display: none;
  position: absolute;
  top: 1.625rem;
  right: 1.625rem;
  max-width: min-content;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
`;

export const ClearListButton = styled(IconButton)`
  display: flex;
  margin-left: 0.5rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }

  &:hover + ${ClearListButtonTooltip} {
    display: flex;
  }
`;
