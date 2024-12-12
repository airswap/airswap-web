import { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import ProtocolFeeModal from "../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import ModalOverlay from "../ModalOverlay/ModalOverlay";

interface ProtocolFeeOverlayProps {
  isHidden: boolean;
  onCloseButtonClick: () => void;
  className?: string;
}

const ProtocolFeeOverlay: FC<ProtocolFeeOverlayProps> = ({
  className = "",
  isHidden,
  onCloseButtonClick,
}): ReactElement => {
  const { t } = useTranslation();

  return (
    <ModalOverlay
      title={t("information.protocolFee.title")}
      isHidden={!isHidden}
      onClose={onCloseButtonClick}
      className={className}
    >
      <ProtocolFeeModal onCloseButtonClick={onCloseButtonClick} />
    </ModalOverlay>
  );
};

export default ProtocolFeeOverlay;
