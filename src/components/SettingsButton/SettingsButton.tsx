import { useCallback, useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return;
      }
      setSettingsOpen(false);
    },
    [setSettingsOpen]
  );

  const handleEscKey = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        setSettingsOpen(false);
      }
    },
    [setSettingsOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscKey, false);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscKey, false);
    };
  }, [handleClick, handleEscKey]);

  return (
    <SettingIconButtonContainer ref={containerRef}>
      <SettingsIconButton
        iconSize={1.5}
        icon="settings"
        onClick={() => setSettingsOpen(!settingsOpen)}
      />
      {settingsOpen && <SettingsPopover />}
    </SettingIconButtonContainer>
  );
};

export default SettingsButton;
