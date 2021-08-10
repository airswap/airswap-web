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
  InfoHeading,
  InfoSubHeading,
} from "./Typography";

export default {
  title: "components/Typography/Overview",
} as Meta;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  row-gap: 2rem;
  column-gap: 5rem;
`;

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const Template: Story<TitleProps> = (args) => (
  <Grid>
    <FlexCol>
      <Subtitle>Title</Subtitle>
      <Metadata>type: h1</Metadata>
    </FlexCol>
    <Title type="h1">The quick brown fox jumps over the lazy dog</Title>
    <FlexCol>
      <Subtitle>Title</Subtitle>
      <Metadata>type: h2</Metadata>
    </FlexCol>
    <Title type="h2">The quick brown fox jumps over the lazy dog</Title>
    <FlexCol>
      <Subtitle>Title</Subtitle>
      <Metadata>type: h3</Metadata>
    </FlexCol>
    <Title type="h3">The quick brown fox jumps over the lazy dog</Title>
    <FlexCol>
      <Subtitle>Title</Subtitle>
      <Metadata>type: h4</Metadata>
    </FlexCol>
    <Title type="h4">The quick brown fox jumps over the lazy dog</Title>
    <FlexCol>
      <Subtitle>Subtitle</Subtitle>
    </FlexCol>
    <Subtitle>The quick brown fox jumps over the lazy dog</Subtitle>
    <FlexCol>
      <Subtitle>Paragraph</Subtitle>
    </FlexCol>
    <Paragraph>The quick brown fox jumps over the lazy dog</Paragraph>
    <FlexCol>
      <Subtitle>Info Heading</Subtitle>
    </FlexCol>
    <InfoHeading>The quick brown fox jumps over the lazy dog</InfoHeading>
    <FlexCol>
      <Subtitle>Info Sub Heading</Subtitle>
    </FlexCol>
    <InfoSubHeading>The quick brown fox jumps over the lazy dog</InfoSubHeading>
    <FlexCol>
      <Subtitle>Form Label</Subtitle>
    </FlexCol>
    <FormLabel>The quick brown fox jumps over the lazy dog</FormLabel>
    <FlexCol>
      <Subtitle>Navigation</Subtitle>
    </FlexCol>
    <Navigation>The quick brown fox jumps over the lazy dog</Navigation>
    <FlexCol>
      <Subtitle>Metadata</Subtitle>
    </FlexCol>
    <Metadata>The quick brown fox jumps over the lazy dog</Metadata>
  </Grid>
);

export const AllTypography = Template.bind({});
