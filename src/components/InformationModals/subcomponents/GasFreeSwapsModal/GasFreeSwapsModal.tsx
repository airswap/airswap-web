import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { ModalParagraph } from "../../../../styled-components/Modal/Modal";
import { OverlayActionButton } from "../../../Overlay/Overlay.styles";
import { Container } from "./GasFreeModal.styles";

interface GasFreeSwapsModalProps {
  onCloseButtonClick: () => void;
}

const GasFreeSwapsModal: FC<GasFreeSwapsModalProps> = ({
  onCloseButtonClick,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <ModalParagraph>{t("information.gasFreeSwaps.paragraph")}</ModalParagraph>
      <ModalParagraph>
        {t("information.gasFreeSwaps.paragraph2")}
      </ModalParagraph>
      <OverlayActionButton onClick={onCloseButtonClick}>
        {t("common.back")}
      </OverlayActionButton>
    </Container>
  );
};

export default GasFreeSwapsModal;
