import ProtocolFeeModal from "../InformationModals/subcomponents/ProtocolFeeModal/ProtocolFeeModal";
import Overlay from "../Overlay/Overlay";
import { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

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
    <Overlay
      title={t("information.protocolFee.title")}
      isHidden={!isHidden}
      onCloseButtonClick={onCloseButtonClick}
      className={className}
    >
      <ProtocolFeeModal onCloseButtonClick={onCloseButtonClick} />
    </Overlay>
  );
};

export default ProtocolFeeOverlay;
