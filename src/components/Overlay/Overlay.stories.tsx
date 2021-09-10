import { Story, Meta } from "@storybook/react";

import styled from "styled-components/macro";

import Overlay, { OverlayProps } from "./Overlay";

export default {
  title: "components/Overlay",
  component: Overlay,
  argTypes: {
    title: { control: { type: "text" }, defaultValue: "Title" },
    isHidden: { control: { type: "boolean" }, defaultValue: false },
  },
} as Meta;

const Container = styled.div`
  position: relative;
  width: 30rem;
  height: 25rem;
`;

const Template: Story<OverlayProps> = (args) => (
  <Container>
    <Overlay {...args}>
      <h3>Content</h3>
    </Overlay>
  </Container>
);

export const Standard = Template.bind({});
Standard.args = {};
