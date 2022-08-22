import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  ModalParagraph,
  ScrollableModalContainer,
} from "../../../../styled-components/Modal/Modal";
import { StyledCloseButton } from "./FeeModal.styles";

type FeeModalProps = {
  onCloseButtonClick: () => void;
};

const FeeModal: FC<FeeModalProps> = ({ onCloseButtonClick }) => {
  const { t } = useTranslation();

  return (
    <ScrollableModalContainer>
      <ModalParagraph>Fee text here</ModalParagraph>
      <StyledCloseButton onClick={onCloseButtonClick}>
        {t("common.back")}
      </StyledCloseButton>
    </ScrollableModalContainer>
  );
};

export default FeeModal;
