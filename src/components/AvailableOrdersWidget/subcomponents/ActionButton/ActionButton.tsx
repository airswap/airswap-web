import { CreateSwapButton } from "./ActionButton.styles";
import { FC } from "react";

type ActionButtonProps = {
  title: string;
  onClick: () => void;
};
const ActionButton: FC<ActionButtonProps> = ({ title, onClick }) => {
  return <CreateSwapButton onClick={onClick}>{title}</CreateSwapButton>;
};

export default ActionButton;
