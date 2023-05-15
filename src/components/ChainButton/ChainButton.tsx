import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  Container,
  ChainButtonContainer,
} from "../ChainButton/ChainButton.style";
import Icon from "../Icon/Icon";

type ChainButtonButtonType = {
  chainSelectionOpen: boolean;
  transactionsTabOpen: boolean;
  setChainSelectionOpen: (x: boolean) => void;
  className?: string;
};

const ChainButtonButton = ({
  chainSelectionOpen,
  transactionsTabOpen,
  setChainSelectionOpen,
  className,
}: ChainButtonButtonType) => {
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
      setChainSelectionOpen(false);
    },
    [setChainSelectionOpen]
  );

  const handleEscKey = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        setChainSelectionOpen(false);
      }
    },
    [setChainSelectionOpen]
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
      <Container
        className={className}
        ref={containerRef}
        open={transactionsTabOpen}
      >
        <ChainButtonContainer
          aria-label={t("common.settings")}
          onClick={() => setChainSelectionOpen(!chainSelectionOpen)}
        >
          <Icon iconSize={1.5} name="settings" />
        </ChainButtonContainer>
      </Container>
    </>
  );
};

export default ChainButtonButton;
