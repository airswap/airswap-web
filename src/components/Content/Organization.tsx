import { Paragraph, Title } from "../Typography/Typography";
import { Container, Link } from "./Content.style";

const Organization = () => {
  return (
    <>
      <Container>
        <Title type="h1">Stake to Join</Title>
        <Paragraph>
          We are an open developer community building decentralized trading
          systems.
          <br />
          <br />
          More content will be displayed here soon.
        </Paragraph>
        <Link href="https://activate.codefi.network/staking/airswap/governance">
          Stake your tokens →
        </Link>
      </Container>
    </>
  );
};

export default Organization;
