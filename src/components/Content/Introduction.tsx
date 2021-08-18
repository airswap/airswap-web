import { Paragraph, Title } from "../Typography/Typography";
import { Container, Link } from "./Content.style";

const Introduction = () => {
  return (
    <Container>
      <Title type="h1">Lorem ipsum dolor sit amet, consectetur</Title>
      <Paragraph>
        Token holders decide what to build and work together to get it done.
      </Paragraph>
      <Link href="#">Learn more →</Link>
    </Container>
  );
};

export default Introduction;
