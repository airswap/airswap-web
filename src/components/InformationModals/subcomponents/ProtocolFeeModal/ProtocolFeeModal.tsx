import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { ModalParagraph } from "../../../../styled-components/Modal/Modal";
import { OverlayActionButton } from "../../../Overlay/Overlay.styles";
import { FeeContainer } from "./ProtocolFeeModal.styles";

type ProtocolFeeModalProps = {
  onCloseButtonClick: () => void;
};

const ProtocolFeeModal: FC<ProtocolFeeModalProps> = ({
  onCloseButtonClick,
}) => {
  const { t } = useTranslation();

  return (
    <FeeContainer>
      <ModalParagraph>{t("information.protocolFee.paragraph")}</ModalParagraph>
      <OverlayActionButton onClick={onCloseButtonClick}>
        {t("common.back")}
      </OverlayActionButton>
    </FeeContainer>
  );
};

export default ProtocolFeeModal;
