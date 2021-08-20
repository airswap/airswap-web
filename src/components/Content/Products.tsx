import { Paragraph, Title } from "../Typography/Typography";
import { Container, Link } from "./Content.style";

const Products = () => {
  return (
    <>
      <Container>
        <Title type="h1">Peer-to-peer Trading</Title>
        <Paragraph>
          We are an open developer community building decentralized trading
          systems.
          <br />
          <br />
          More content will be displayed here soon.
        </Paragraph>
        <Link href="https://docs.airswap.io/">Check the docs →</Link>
      </Container>
    </>
  );
};

export default Products;
