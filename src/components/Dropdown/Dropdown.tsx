import React from "react";

import Icon from "../Icon/Icon";
import { Item, Wrapper, AbsoluteWrapper, Current } from "./Dropdown.styles";

export type SelectOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  value: SelectOption;
  options: SelectOption[];
  onChange: (option: SelectOption) => void;
  className?: string;
};

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  className,
}) => {
  function handleChange(newOption: SelectOption) {
    onChange(newOption);
  }

  return (
    <Wrapper className={className}>
      <Current>
        {value.label}
        <Icon name={"chevron-down"} />
      </Current>
      <AbsoluteWrapper>
        {options
          .filter((option) => option.value !== value.value)
          .map((option) => {
            return (
              <Item
                key={option.value}
                onClick={() => {
                  handleChange(option);
                }}
              >
                {option.label}
              </Item>
            );
          })}
      </AbsoluteWrapper>
    </Wrapper>
  );
};
