import { useState } from "react";

import IconButton from "../IconButton/IconButton";
import SettingsPopover from "../SettingsPopover/SettingsPopover";

const SettingsButton = () => {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  return (
    <>
      <IconButton
        iconSize={1.5}
        icon="settings"
        onClick={() => setSettingsOpen(!settingsOpen)}
      />
      {settingsOpen ? <SettingsPopover /> : null}
    </>
  );
};

export default SettingsButton;
