import React, { useState } from "react";

import Icon from "../Icon/Icon";
import { Item, Wrapper, AbsoluteWrapper, Current } from "./Dropdown.styles";

export type SelectOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  value?: SelectOption;
  options: SelectOption[];
  onChange: (option: SelectOption) => void;
  width?: number;
};

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  width,
}) => {
  const [showOptions, setShowOptions] = useState<Boolean>(false);

  function handleChange(newOption: SelectOption) {
    onChange(newOption);
  }

  function handleShow() {
    setShowOptions(!showOptions);
  }

  return (
    <Wrapper>
      <Current
        optionsShown={showOptions ? true : false}
        itemWidth={width}
        onClick={() => {
          handleShow();
        }}
      >
        <Item>{value ? value.label : options[0].label}</Item>
        <Icon name={"chevron-down"}></Icon>
      </Current>
      {showOptions && (
        <AbsoluteWrapper
          itemWidth={width}
          onClick={() => {
            handleShow();
          }}
        >
          {options.map((option, index) => {
            return (
              <Item
                isSelected={
                  value
                    ? value.label === option.label
                      ? true
                      : false
                    : index === 0
                    ? true
                    : false
                }
                onClick={() => {
                  handleChange(option);
                }}
              >
                {option.label}
              </Item>
            );
          })}
        </AbsoluteWrapper>
      )}
    </Wrapper>
  );
};
