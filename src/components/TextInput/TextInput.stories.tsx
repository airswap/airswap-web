import { Story, Meta } from "@storybook/react";

import TextInput, { TextInputProps } from "./TextInput";
import styled from 'styled-components/macro';

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

const StyledWrapper = styled.div`
  padding: 1rem;
  width: 20rem;
  background: ${(props) => props.theme.colors.black};
`;

const Template: Story<TextInputProps> = (args) => <StyledWrapper><TextInput {...args} /></StyledWrapper>;


export const Primary = Template.bind({});
Primary.args = {
  label: "Label",
  value: "text",
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Primary.args,
  disabled: true,
};

export const HasError = Template.bind({});
HasError.args = {
  ...Primary.args,
  hasError: true,
};

export const NumberInput = Template.bind({});
NumberInput.args = {
  ...Primary.args,
  label: "Number input",
  type: 'number',
  value: 9
};
