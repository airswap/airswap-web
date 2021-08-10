import { StyledDarkModeSwitch } from "./DarkModeSwitch.styles";

type DarkModeProps = {
  className?: string;
  onClick: () => void;
};

const DarkModeSwitch = ({ className, onClick }: DarkModeProps): JSX.Element => {
  return (
    <StyledDarkModeSwitch
      className={className}
      iconSize={1.5}
      icon="dark-mode-switch"
      onClick={onClick}
    />
  );
};

export default DarkModeSwitch;
