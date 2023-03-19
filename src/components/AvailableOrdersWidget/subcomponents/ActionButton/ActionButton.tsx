import { FC } from "react";

import { CreateSwapButton } from "./ActionButton.styles";

type ActionButtonProps = {
  title: string;
  onClick: () => void;
};
const ActionButton: FC<ActionButtonProps> = ({ title, onClick }) => {
  return <CreateSwapButton onClick={onClick}>{title}</CreateSwapButton>;
};

export default ActionButton;
