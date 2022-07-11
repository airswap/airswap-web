import { Story, Meta } from "@storybook/react";

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
  options: [
    { label: "MINUTE", value: "60" },
    { label: "HOUR", value: "50" },
    { label: "DAY", value: "4" },
    { label: "WEEK", value: "3" },
  ],
  onChange: (option: SelectOption) => {},
};
