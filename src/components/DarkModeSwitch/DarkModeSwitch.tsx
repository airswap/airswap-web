import Icon from '../Icon/Icon';

type DarkModeProps = {
  className?: string;
  onClick: () => void;
};

const DarkModeSwitch = ({ className, onClick }: DarkModeProps): JSX.Element => {

  return (
    <button
      onClick={onClick}
      className={className}
    >
      <Icon name="dark-mode-switch" />
    </button>
  );
};

export default DarkModeSwitch;
