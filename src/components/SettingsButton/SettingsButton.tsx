import SettingsPopover from "../SettingsPopover/SettingsPopover";
import {
  SettingIconButtonContainer,
  SettingsIconButton,
} from "./SettingsButton.style";

type SettingsButtonType = {
  settingsOpen: boolean;
  setSettingsOpen: (x: boolean) => void;
};

const SettingsButton = ({
  settingsOpen,
  setSettingsOpen,
}: SettingsButtonType) => {
  return (
    <SettingIconButtonContainer>
      <SettingsIconButton
        iconSize={1.5}
        icon="settings"
        onClick={() => setSettingsOpen(!settingsOpen)}
      />
      {settingsOpen ? <SettingsPopover /> : null}
    </SettingIconButtonContainer>
  );
};

export default SettingsButton;
