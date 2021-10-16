import { Title } from "../Typography/Typography";
import { Header } from "./ErrorList.styles";
import errorMessages from "./ErrorMessages.json";

type ErrorListProps = {
  error: string;
};

const ErrorList = ({ error }: ErrorListProps) => {
  return (
    <>
      <Header>
        <Title type="h2"></Title>
      </Header>
    </>
  );
};

export default ErrorList;
