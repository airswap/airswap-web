import React, { FC } from "react";

import JoinModal from "./subcomponents/JoinModal/JoinModal";

export type InformationModalType = "stats" | "join";

type InformationModalProps = {
  activeModal: InformationModalType | null;
};

const InformationModals: FC<InformationModalProps> = ({ activeModal }) => {
  return <>{activeModal === "join" && <JoinModal />}</>;
};

export default InformationModals;
