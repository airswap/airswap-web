import {
  Container,
  TitleContainer,
  Line,
  Title,
} from "./PopoverSection.styles";

type PopoverSectionType = {
  title: string;
  children: React.ReactChild;
};

const PopoverSection = ({ title, children }: PopoverSectionType) => {
  return (
    <Container>
      <TitleContainer>
        <Title type="h4">
          <Line>{title}</Line>
        </Title>
      </TitleContainer>
      {children}
    </Container>
  );
};

export default PopoverSection;
