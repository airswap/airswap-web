import React, { FC } from "react";

import {
  ModalCloseButton,
  StyledModal,
} from "../../styled-components/Modal/Modal";
import JoinModal from "./subcomponents/JoinModal/JoinModal";

export type InformationType = "stats" | "about" | "join";

type InformationModalProps = {
  activeModal: InformationType | null;
  onCloseModalClick: () => void;
};

const InformationModals: FC<InformationModalProps> = ({
  activeModal,
  onCloseModalClick,
}) => {
  return (
    <StyledModal
      isOpen={!!activeModal}
      onBackgroundClick={onCloseModalClick}
      onEscapeKeydown={onCloseModalClick}
    >
      {activeModal === "stats" && <span>stats</span>}
      {activeModal === "about" && <span>about</span>}
      {activeModal === "join" && <JoinModal />}
      <ModalCloseButton
        icon="exit-modal"
        iconSize={1.5}
        onClick={onCloseModalClick}
      />
    </StyledModal>
  );
};

export default InformationModals;
