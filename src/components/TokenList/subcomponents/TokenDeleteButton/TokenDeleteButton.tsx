import { useTranslation } from "react-i18next";

import { Container, Text } from "./TokenDeleteButton.styles";

type TokenDeleteButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const TokenDeleteButton = ({ onClick }: TokenDeleteButtonProps) => {
  const { t } = useTranslation();

  return (
    <Container onClick={onClick}>
      <Text>{t("orders.removeFromActive")}</Text>
    </Container>
  );
};

export default TokenDeleteButton;
