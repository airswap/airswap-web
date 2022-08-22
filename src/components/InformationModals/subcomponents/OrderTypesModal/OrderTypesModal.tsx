import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  ModalParagraph,
  ModalSubTitle,
  ScrollableModalContainer,
} from "../../../../styled-components/Modal/Modal";
import { StyledCloseButton } from "./OrderTypesModal.styles";

type OrderTypesModalProps = {
  onCloseButtonClick: () => void;
};

const OrderTypesModal: FC<OrderTypesModalProps> = ({ onCloseButtonClick }) => {
  const { t } = useTranslation();

  return (
    <ScrollableModalContainer>
      <ModalSubTitle type="h2">
        {t("information.orderTypes.anyoneListed")}
      </ModalSubTitle>
      <ModalParagraph>{t("information.orderTypes.paragraph")}</ModalParagraph>
      <ModalSubTitle type="h2">
        {t("information.orderTypes.anyoneUnlisted")}
      </ModalSubTitle>
      <ModalParagraph>{t("information.orderTypes.paragraph2")}</ModalParagraph>
      <ModalSubTitle type="h2">
        {t("information.orderTypes.someoneUnlisted")}
      </ModalSubTitle>
      <ModalParagraph>{t("information.orderTypes.paragraph3")}</ModalParagraph>
      <StyledCloseButton onClick={onCloseButtonClick}>
        {t("common.back")}
      </StyledCloseButton>
    </ScrollableModalContainer>
  );
};

export default OrderTypesModal;
