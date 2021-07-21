import { Story, Meta } from "@storybook/react";
import styled from "styled-components/macro";

import {
  Subtitle,
  Title,
  TitleProps,
  Paragraph,
  Navigation,
  Metadata,
  FormLabel,
} from "./Typography";

export default {
  title: "components/Typography/Title",
  // component: Title
} as Meta;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  row-gap: 2rem;
  column-gap: 5rem;
`;

const Template: Story<TitleProps> = (args) => (
  <Grid>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Title</Subtitle>
      <Metadata>type: h1</Metadata>
    </div>
    <Title type="h1">The quick brown fox jumps over the lazy dog</Title>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Title</Subtitle>
      <Metadata>type: h2</Metadata>
    </div>
    <Title type="h2">The quick brown fox jumps over the lazy dog</Title>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Title</Subtitle>
      <Metadata>type: h3</Metadata>
    </div>
    <Title type="h3">The quick brown fox jumps over the lazy dog</Title>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Title</Subtitle>
      <Metadata>type: h4</Metadata>
    </div>
    <Title type="h4">The quick brown fox jumps over the lazy dog</Title>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Subtitle</Subtitle>
    </div>
    <Subtitle>The quick brown fox jumps over the lazy dog</Subtitle>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Paragraph</Subtitle>
    </div>
    <Paragraph>The quick brown fox jumps over the lazy dog</Paragraph>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Form Label</Subtitle>
    </div>
    <FormLabel>The quick brown fox jumps over the lazy dog</FormLabel>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Navigation</Subtitle>
    </div>
    <Navigation>The quick brown fox jumps over the lazy dog</Navigation>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Subtitle>Metadata</Subtitle>
    </div>
    <Metadata>The quick brown fox jumps over the lazy dog</Metadata>
  </Grid>
);

export const Primary = Template.bind({});
