import React, { FC } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectUserSettings } from "../../features/userSettings/userSettingsSlice";
import { darkTheme, lightTheme } from "../../style/themes";
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
  // TODO: For some reason StyledModal doesn't inherit theme, so we have to import it again here.
  const { theme } = useAppSelector(selectUserSettings);

  return (
    <StyledModal
      theme={theme === "dark" ? darkTheme : lightTheme}
      isOpen={!!activeModal}
      onBackgroundClick={onCloseModalClick}
      onEscapeKeydown={onCloseModalClick}
    >
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
