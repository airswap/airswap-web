import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Button from "../Button/Button";
import ChainSelectionPopover from "../ChainSelectionPopover/ChainSelectionPopover";
import Icon from "../Icon/Icon";
import { Container, ChainSelectButton } from "./ChainButton.style";

type ChainButtonButtonType = {
  chainSelectionOpen: boolean;
  transactionsTabOpen: boolean;
  setChainSelectionOpen: (x: boolean) => void;
  className?: string;
};

/**
 * @remarks this component is for the button which renders a dropdown with a list of networks. The UL of networks is called ChainSelectionPopover
 * @param param0
 * @returns
 */
const ChainButtonButton = ({
  chainSelectionOpen,
  transactionsTabOpen,
  setChainSelectionOpen,
  className,
}: ChainButtonButtonType) => {
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
        <ChainSelectButton
          onClick={() => {
            console.log("network button - UNDER CONSTRUCTION");
          }}
        >
          {/* TODO: add network to Redux store, then render that below */}
          <span>Ethereum</span>
          {/* {renderContent()} */}
        </ChainSelectButton>
      </Container>
      {chainSelectionOpen && (
        <ChainSelectionPopover
          open={transactionsTabOpen}
          popoverRef={popoverRef}
        />
      )}
    </>
  );
};

export default ChainButtonButton;
