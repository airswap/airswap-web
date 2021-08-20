import { Paragraph, Title } from "../Typography/Typography";
import { Container, Link } from "./Content.style";

const Introduction = () => {
  return (
    <>
      <Container>
        <Title type="h1">Welcome to AirSwap</Title>
        <Paragraph>
          We are an open developer community building decentralized trading
          systems.
          <br />
          <br />
          More content will be displayed here soon.
        </Paragraph>
        <Link href="https://chat.airswap.io/">Join the Discord →</Link>
      </Container>
    </>
  );
};

export default Introduction;
