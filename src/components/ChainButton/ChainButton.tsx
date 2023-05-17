import { useCallback, useEffect, useRef } from "react";

import { useAppSelector } from "../../app/hooks";
import {
  SUPPORTED_NETWORKS,
  NETWORK_CHAINS,
} from "../../constants/supportedNetworks";
import { selectWallet } from "../../features/wallet/walletSlice";
// import Button from "../Button/Button";
import ChainSelectionPopover from "../ChainSelectionPopover/ChainSelectionPopover";
import { Container, ChainSelectButton, ChainIcon } from "./ChainButton.style";

type ChainButtonType = {
  chainSelectionOpen: boolean;
  setChainSelectionOpen: (x: boolean) => void;
  className?: string;
};

/**
 * @remarks this component is for the button which renders a dropdown with a list of networks. The UL of networks is called ChainSelectionPopover
 * @param param0
 * @returns
 */
const ChainButton = ({
  chainSelectionOpen,
  setChainSelectionOpen,
  className,
}: ChainButtonType) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const wallet = useAppSelector(selectWallet);
  const network = NETWORK_CHAINS[wallet.chainId || ""];

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
        open={chainSelectionOpen}
      >
        <ChainSelectButton
          aria-label={"common.settings"}
          onClick={() => {
            setChainSelectionOpen(!chainSelectionOpen);
          }}
        >
          {/* TODO: add network to Redux store, then render that below. Get icon dynamically from currently selected chain */}
          <ChainIcon
            src={SUPPORTED_NETWORKS[network]?.icon}
            alt={`${"Ethereum"} icon`}
          />
          {network || "Unsupported network"}
        </ChainSelectButton>
      </Container>
      {chainSelectionOpen && (
        <ChainSelectionPopover
          open={chainSelectionOpen}
          popoverRef={popoverRef}
        />
      )}
    </>
  );
};

export default ChainButton;
