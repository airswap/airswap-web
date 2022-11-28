import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { ModalParagraph } from "../../../../styled-components/Modal/Modal";
import { OverlayActionButton } from "../../../Overlay/Overlay.styles";
import { FeeContainer } from "./FeeModal.styles";

type FeeModalProps = {
  onCloseButtonClick: () => void;
};

const FeeModal: FC<FeeModalProps> = ({ onCloseButtonClick }) => {
  const { t } = useTranslation();

  return (
    <FeeContainer>
      <ModalParagraph>Fee Text Here</ModalParagraph>
      <OverlayActionButton onClick={onCloseButtonClick}>
        {t("common.back")}
      </OverlayActionButton>
    </FeeContainer>
  );
};

export default FeeModal;
