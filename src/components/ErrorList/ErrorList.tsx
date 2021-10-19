import { useTranslation } from "react-i18next";

import { Title, InfoSubHeading } from "../Typography/Typography";
import { Header } from "./ErrorList.styles";

type ErrorListProps = {
  error: string;
};

const ErrorList = ({ error }: ErrorListProps) => {
  const { t } = useTranslation(["validatorErrors"]);
  return (
    <>
      <Header>
        <Title type="h2">{t("validatorErrors:unableSwap")}</Title>
        <InfoSubHeading>{t("validatorErrors:swapFail")}</InfoSubHeading>
      </Header>
    </>
  );
};

export default ErrorList;
