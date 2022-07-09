import React, { useState } from "react";

import Icon from "../Icon/Icon";
import {
  Selector,
  Item,
  Wrapper,
  Arrow,
  AbsoluteWrapper,
} from "./Dropdown.styles";

export type SelectOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  category: SelectOption;
  options: SelectOption[];
  onChange: (option: SelectOption) => void;
};

export const Dropdown: React.FC<DropdownProps> = ({
  category,
  options,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState(category);

  function handleChange(newOption: SelectOption) {
    setSelectedOption(newOption);
    onChange(selectedOption);
  }

  return (
    <Wrapper>
      <AbsoluteWrapper
        onClick={(event) => {
          event.currentTarget.classList.toggle("show");
        }}
      >
        <Selector>
          <Item
            className={`${
              selectedOption === category ? "selected category" : "category"
            }`}
          >
            <a>{selectedOption.label}</a>
          </Item>
          {options.map((option, index) => {
            return (
              <Item
                className={`${selectedOption === option ? "selected" : ""}`}
                onClick={() => {
                  handleChange(options[index]);
                }}
              >
                <a>{option.label}</a>
              </Item>
            );
          })}
        </Selector>
        <Arrow>
          <Icon name={"chevron-down"}></Icon>
        </Arrow>
      </AbsoluteWrapper>
    </Wrapper>
  );
};
