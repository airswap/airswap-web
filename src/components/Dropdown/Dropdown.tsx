import React, { useMemo, useState } from "react";

import Icon from "../Icon/Icon";
import {
  Option,
  Wrapper,
  SelectOptions,
  Current,
  ItemBackground,
  ButtonText,
} from "./Dropdown.styles";

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
  const activeOptionIndex = useMemo(
    () => options.findIndex((option) => option.value === value.value),
    [options, value]
  );

  const [activeHoverIndex, setActiveHoverIndex] = useState(activeOptionIndex);

  const handleOptionClick = (newOption: SelectOption) => {
    onChange(newOption);
  };

  const handleCurrentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Unlike other browsers, on safari clicking a button won't focus it.
    e.currentTarget.focus();
  };

  return (
    <Wrapper className={className}>
      <Current onClick={handleCurrentClick}>
        <ButtonText>{value.label}</ButtonText>
        <Icon name={"chevron-up-down"} iconSize={1.5} />
      </Current>
      <SelectOptions activeIndex={activeOptionIndex}>
        {options.map((option, index) => {
          return (
            <Option
              key={option.value}
              isActive={activeHoverIndex === index}
              index={index}
              onMouseOver={() => setActiveHoverIndex(index)}
              onPointerDown={() => {
                handleOptionClick(option);
              }}
            >
              <ButtonText>{option.label}</ButtonText>
            </Option>
          );
        })}
        <ItemBackground />
      </SelectOptions>
    </Wrapper>
  );
};
