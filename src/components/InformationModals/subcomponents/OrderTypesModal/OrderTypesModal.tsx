import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  ModalParagraph,
  ModalSubTitle,
} from "../../../../styled-components/Modal/Modal";
import { Container, StyledCloseButton } from "./OrderTypesModal.styles";

type OrderTypesModalProps = {
  onCloseButtonClick: () => void;
};

const OrderTypesModal: FC<OrderTypesModalProps> = ({ onCloseButtonClick }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <ModalSubTitle type="h2">
        {t("information.counterParty.specify.title")}
      </ModalSubTitle>
      <ModalParagraph>
        {t("information.counterParty.specify.paragraph")}
      </ModalParagraph>
      <ModalSubTitle type="h2">
        {t("information.counterParty.anyone.title")}
      </ModalSubTitle>
      <ModalParagraph>
        {t("information.counterParty.anyone.paragraph")}
      </ModalParagraph>
      <StyledCloseButton onClick={onCloseButtonClick}>
        {t("common.back")}
      </StyledCloseButton>
    </Container>
  );
};

export default OrderTypesModal;
