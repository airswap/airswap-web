import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Icon from "../Icon/Icon";
import SettingsPopover from "../SettingsPopover/SettingsPopover";
import { Container, SettingsButtonContainer } from "./SettingsButton.style";

type SettingsButtonType = {
  settingsOpen: boolean;
  transactionsTabOpen: boolean;
  setSettingsOpen: (x: boolean) => void;
};

const SettingsButton = ({
  settingsOpen,
  transactionsTabOpen,
  setSettingsOpen,
}: SettingsButtonType) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e) => {
      if (
        (containerRef.current && containerRef.current.contains(e.target)) ||
        (popoverRef.current && popoverRef.current.contains(e.target))
      ) {
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
    <>
      <Container ref={containerRef} open={transactionsTabOpen}>
        <SettingsButtonContainer
          aria-label={t("common.settings")}
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <Icon iconSize={1.5} name="settings" />
        </SettingsButtonContainer>
      </Container>
      {settingsOpen && (
        <SettingsPopover open={transactionsTabOpen} popoverRef={popoverRef} />
      )}
    </>
  );
};

export default SettingsButton;
