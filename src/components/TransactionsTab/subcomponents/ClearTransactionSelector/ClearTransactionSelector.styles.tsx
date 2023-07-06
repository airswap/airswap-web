import styled from "styled-components/macro";
import { Tooltip } from "../../../../styled-components/Tooltip/Tooltip";
import Dropdown from "../../../Dropdown/Dropdown";
import { SelectButtonText } from "../../../Dropdown/Dropdown.styles";


export const StyledTooltip = styled(Tooltip) <{
  $isSelectorOpen: boolean;
  $isTooltip: boolean;
}>`
  display: ${({ $isSelectorOpen, $isTooltip }) =>
    !$isSelectorOpen && $isTooltip ? "flex" : "none"};
  position: absolute;
  z-index: 3;
  max-width: min-content;
  white-space: nowrap;
  margin-top: -1rem;
  margin-left: 15rem;
`;

export const SelectWrapper = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  justify-content: end;
  position: relative;
  margin-top: -2rem;
  top: 3.5rem;
  right: 1.5rem;
  height: 2rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
`;

export const StyledDropdown = styled(Dropdown)`
  ${SelectButtonText}

  text-align: left;
  width: 5rem;
`;
