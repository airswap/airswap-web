import { Story, Meta } from "@storybook/react";

import TextInput, { TextInputProps } from "./TextInput";

export default {
  title: "components/TextInput",
  component: TextInput,
  argTypes: {
    label: { control: { type: "text" } },
    value: { control: { type: "text" } },
    className: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
    hasError: { control: { type: "boolean" } },
    hideLabel: { control: { type: "boolean" } },
  },
} as Meta;

const Template: Story<TextInputProps> = (args) => <TextInput {...args} />;


export const Primary = Template.bind({});
Primary.args = {
  label: "Label",
  value: "text",
};
