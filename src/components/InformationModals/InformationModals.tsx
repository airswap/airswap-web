import React, { FC } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectTheme } from "../../features/userSettings/userSettingsSlice";
import { darkTheme, lightTheme } from "../../style/themes";
import {
  ModalCloseButton,
  StyledModal,
} from "../../styled-components/Modal/Modal";
import JoinModal from "./subcomponents/JoinModal/JoinModal";

export type InformationPageType = "stats" | "join";

type InformationPageProps = {
  activeModal: InformationPageType | null;
};

const InformationModals: FC<InformationPageProps> = ({
  activeModal,
}) => {
  return (
    <>
      {activeModal === "join" && <JoinModal />}
    </>
  );
};

export default InformationModals;
