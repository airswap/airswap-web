import { useTranslation } from "react-i18next";
import {StyledTokenDeleteButton, Text} from "./TokenDeleteButton.styles";

type TokenDeleteButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TokenDeleteButton = ({ onClick }: TokenDeleteButtonProps) => {
  const { t } = useTranslation(["orders"]);

  return (
    <StyledTokenDeleteButton onClick={onClick}>
      <Text>{t('orders:removeFromActive')}</Text>
    </StyledTokenDeleteButton>
  )
};

export default TokenDeleteButton;
