import React, { useMemo, useRef, useState } from "react";

import Icon from "../Icon/Icon";
import { Sizer } from "../MakeWidget/subcomponents/ExpirySelector/ExpirySelector.styles";
import {
  Option,
  Wrapper,
  SelectOptions,
  Select,
  ItemBackground,
  SelectButtonText,
  NativeSelect,
  NativeSelectWrapper,
  NativeSelectIcon,
  DropdownButtonText,
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
  const sizerRef = useRef<HTMLDivElement>(null);

  const sizerWidth = useMemo(() => {
    return sizerRef.current?.clientWidth || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizerRef.current]);

  const [activeOptionIndex, setActiveOptionIndex] = useState(
    options.findIndex((option) => option.value === selectedOption.value)
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

  const handleSelectBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    const index = options.findIndex(
      (option) => option.value === selectedOption.value
    );
    setActiveOptionIndex(index);
    setActiveHoverIndex(index);
  };

  const handleSelectClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Unlike other browsers, on safari clicking a button won't focus it.
    e.currentTarget.focus();
  };

  return (
    <Wrapper className={className}>
      <Select onClick={handleSelectClick} onBlur={handleSelectBlur}>
        <SelectButtonText style={{ width: `${sizerWidth}px` }}>
          {selectedOption.label}
        </SelectButtonText>
        <Icon name={"chevron-up-down"} iconSize={1.5} />
      </Select>
      <SelectOptions activeIndex={activeOptionIndex}>
        {options.map((option, index) => (
          <Option
            key={option.value}
            isActive={activeHoverIndex === index}
            index={index}
            onMouseOver={() => setActiveHoverIndex(index)}
            onPointerDown={() => {
              handleOptionClick(option);
            }}
          >
            <DropdownButtonText>{option.label}</DropdownButtonText>
          </Option>
        ))}
        <ItemBackground />
      </SelectOptions>
      {/*Native Select for mobile*/}
      <NativeSelectWrapper>
        <NativeSelectIcon name={"chevron-up-down"} iconSize={1.5} />
        <NativeSelect
          value={selectedOption.value}
          onChange={handleNativeSelectChange}
        >
          {options.map((option, index) => (
            <Option key={option.value} as="option" value={option.value}>
              {option.label}
            </Option>
          ))}
          ;
        </NativeSelect>
      </NativeSelectWrapper>
      <Sizer ref={sizerRef}>
        {options.map((option) => (
          <SelectButtonText>{option.label}</SelectButtonText>
        ))}
      </Sizer>
    </Wrapper>
  );
};
