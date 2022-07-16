import React, { useMemo, useState } from "react";

import Icon from "../Icon/Icon";
import {
  Option,
  Wrapper,
  SelectOptions,
  Select,
  ItemBackground,
  ButtonText,
  NativeSelect,
  NativeSelectWrapper,
  NativeSelectIcon,
} from "./Dropdown.styles";

export type SelectOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  selectedOption: SelectOption;
  options: SelectOption[];
  onChange: (option: SelectOption) => void;
  className?: string;
};

export const Dropdown: React.FC<DropdownProps> = ({
  selectedOption,
  options,
  onChange,
  className,
}) => {
  const activeOptionIndex = useMemo(
    () => options.findIndex((option) => option.value === selectedOption.value),
    [options, selectedOption]
  );

  const [activeHoverIndex, setActiveHoverIndex] = useState(activeOptionIndex);

  const handleOptionClick = (newSelectedOption: SelectOption) => {
    onChange(newSelectedOption);
  };

  const handleNativeSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSelectedOption = options.find(
      (option) => option.value === e.target.value
    );
    if (newSelectedOption) {
      onChange(newSelectedOption);
    }
  };

  const handleCurrentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Unlike other browsers, on safari clicking a button won't focus it.
    e.currentTarget.focus();
  };

  return (
    <Wrapper className={className}>
      <Select onClick={handleCurrentClick}>
        <ButtonText>{selectedOption.label}</ButtonText>
        <Icon name={"chevron-up-down"} iconSize={1.5} />
      </Select>
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
      {/*Native Select for mobile*/}
      <NativeSelectWrapper>
        <NativeSelectIcon name={"chevron-up-down"} iconSize={1.5} />
        <NativeSelect
          value={selectedOption.value}
          onChange={handleNativeSelectChange}
        >
          {options.map((option, index) => {
            return (
              <Option key={option.value} as="option" value={option.value}>
                {option.label}
              </Option>
            );
          })}
          ;
        </NativeSelect>
      </NativeSelectWrapper>
    </Wrapper>
  );
};
