import React, { FC } from "react";

import { AppRoutes } from "../../routes";
import JoinModal from "./subcomponents/JoinModal/JoinModal";

export type InformationModalType = AppRoutes.join;

type InformationModalProps = {
  activeModal?: InformationModalType;
};

const InformationModals: FC<InformationModalProps> = ({ activeModal }) => {
  return <>{activeModal === AppRoutes.join && <JoinModal />}</>;
};

export default InformationModals;
