import React, { FC, useCallback, useState } from "react";

import Icon from "../Icon/Icon";
import {
  Option,
  Wrapper,
  SelectOptions,
  Select,
  ItemBackground,
  SelectButtonText,
  Sizer,
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

const Dropdown: FC<DropdownProps> = ({
  selectedOption,
  options,
  onChange,
  className,
}) => {
  const [selectWidth, setSelectWidth] = useState<number | undefined>();

  // activeOptionIndex is used for styling SelectOptions vertical position. This way
  // the active option in SelectOptions always opens directly on top of the Select.
  const [activeOptionIndex, setActiveOptionIndex] = useState(
    options.findIndex((option) => option.value === selectedOption.value)
  );

  // activeHoverIndex is for setting the hover effect element position. It is animated
  // so it's a separate div element.
  const [activeHoverIndex, setActiveHoverIndex] = useState(activeOptionIndex);

  const sizerRef = useCallback((node) => {
    if (node !== null) {
      setSelectWidth(node.getBoundingClientRect().width);
    }
  }, []);

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
        <SelectButtonText width={selectWidth}>
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
          <SelectButtonText key={option.value}>{option.label}</SelectButtonText>
        ))}
      </Sizer>
    </Wrapper>
  );
};

export default Dropdown;
