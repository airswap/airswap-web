import { useTranslation } from "react-i18next";
import { BiInfoCircle } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { Container, HiXContainer, TextContainer } from "./GenericToast.styles";

export type GenericToastProps = {
  /**
   * Function to trigger closing of toast
   */
  onClose: () => void;
  /**
   * The type of text shown based off of i18n mapping.
   * enum types: insufficientWalletBalance, gasWarning
   */
  type: any;
  /**
   * Intent of the toast notification that changes background color
   */
  intent?: "error" | "warning";
};

const GenericToast = ({
  onClose,
  type,
  intent = "error",
}: GenericToastProps) => {
  const { t } = useTranslation(["toast", "common"]);

  return (
    <Container intent={intent}>
      <BiInfoCircle style={{ width: "1.5rem", height: "1.5rem" }} />
      <TextContainer>
        <strong>
          {intent === "error" ? t("common:error") : t("common:warning")}
        </strong>
        : {t(type)}
      </TextContainer>
      <HiXContainer>
        <HiX
          style={{
            float: "right",
            margin: "0 1rem 0 0",
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

export default GenericToast;
