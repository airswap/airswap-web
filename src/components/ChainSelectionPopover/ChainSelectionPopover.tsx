import { useState, useRef, RefObject } from "react";

import { useAppDispatch } from "../../app/hooks";
import { store } from "../../app/store";
import { SUPPORTED_NETWORKS } from "../../constants/supportedNetworks";
import {
  Container,
  NetworksContainer,
  NetworkButton,
  NetworkIcon,
} from "./ChainSelectionPopover.styles";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

type ChainSelectionPopoverPropsType = {
  open: boolean;
  popoverRef: RefObject<HTMLDivElement>;
};

/**
 * @remarks this component renders an unordered list with supported networks. Gets rendered onto ChainButton component
 * @returns container with unordered list of networks
 */
const ChainSelectionPopover = ({
  open,
  popoverRef,
}: ChainSelectionPopoverPropsType) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const chainId = store.getState().wallet.chainId;
  console.log(chainId);

  const handleNetworkSwitch = (network: string) => {
    // dispatch(action: wallet);
  };

  const supportedNetworks = Object.keys(SUPPORTED_NETWORKS);

  const networkButtons = supportedNetworks.map((chain: string) => {
    return (
      <NetworkButton
        key={chain}
        $isActive={chainId?.toString() === chain ? true : false}
        onClick={() => handleNetworkSwitch(chain)}
      >
        <NetworkIcon
          src={SUPPORTED_NETWORKS[chain].icon}
          alt={`${chain} icon`}
        />{" "}
        {chain}
      </NetworkButton>
    );
  });

  return (
    <Container ref={popoverRef} open={open}>
      <PopoverSection title="Networks">
        <NetworksContainer ref={scrollContainerRef} $overflow={false}>
          {networkButtons}
        </NetworksContainer>
      </PopoverSection>
    </Container>
  );
};

export default ChainSelectionPopover;
