import { useTranslation } from "react-i18next";
import { HiX } from "react-icons/hi";
import { MdBeenhere, MdError } from "react-icons/md";

import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
import {
  Container,
  HiXContainer,
  IconContainer,
  TextContainer,
} from "./TransactionToast.styles";

export type TransactionToastProps = {
  /**
   * Function to trigger closing of toast
   */
  onClose: () => void;
  /**
   * Error affects whether the icon colors show up as blue or red;
   */
  error?: boolean;
};

const TransactionToast = ({
  onClose,
  error = false,
}: TransactionToastProps) => {
  const { t } = useTranslation(["toast"]);

  return (
    <Container>
      <IconContainer error={error}>
        {error ? (
          <MdError style={{ width: "1.5rem", height: "1.5rem" }} />
        ) : (
          <MdBeenhere style={{ width: "1.5rem", height: "1.5rem" }} />
        )}
      </IconContainer>
      <TextContainer>
        <InfoHeading>{error ? t("toast:transactionFail") : t("toast:transactionSuccess")}</InfoHeading>
        <InfoSubHeading>{error ? t("toast:transactionFailMsg") : t("toast:transactionSuccessMsg")}</InfoSubHeading>
      </TextContainer>
      <HiXContainer>
        <HiX
          style={{
            width: "1rem",
            height: "1rem",
            cursor: "pointer",
          }}
          onClick={onClose}
        />
      </HiXContainer>
    </Container>
  );
};

export default TransactionToast;
