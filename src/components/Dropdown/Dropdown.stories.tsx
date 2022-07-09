import React from "react";

import { Story, Meta } from "@storybook/react";

import { ThemeProvider } from "styled-components";

import { darkTheme, lightTheme } from "../../style/themes";
import { Dropdown, DropdownProps, SelectOption } from "./Dropdown";

export default {
  title: "components/Dropdown",
  component: Dropdown,
  argTypes: {
    label: { control: { type: "string" } },
    name: { control: { type: "string" } },
    value: { control: { type: "SelectOption" } },
    options: { control: { type: "SelectOption[]" } },
    // onChange: { control: { type: "function" } },
  },
} as Meta;

const Template: Story<DropdownProps> = (args) => <Dropdown {...args} />;

export const Time = Template.bind({});
Time.args = {
  category: {
    label: "SELECT TIME:",
    value: "0",
  },
  options: [
    { label: "MINUTE", value: "60" },
    { label: "HOUR", value: "50" },
    { label: "DAY", value: "4" },
    { label: "WEEK", value: "3" },
  ],
  onChange: (option: SelectOption) => {},
};
