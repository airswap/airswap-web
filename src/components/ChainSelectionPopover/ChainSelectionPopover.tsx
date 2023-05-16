import { useState, useRef, RefObject } from "react";

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
  const [overflow, setOverflow] = useState<boolean>(false);
  // TODO: get useState value below from Redux
  const [network, setNetwork] = useState<string>("Ethereum");

  const handleNetworkSwitch = (network: string) => {
    setNetwork(network);
  };

  const supportedNetworks = Object.keys(SUPPORTED_NETWORKS);
  console.log(supportedNetworks);

  const networkButtons = supportedNetworks.map((chain: string) => {
    return (
      <NetworkButton
        key={chain}
        $isActive={network === chain}
        onClick={() => handleNetworkSwitch(chain)}
      >
        <NetworkIcon src={SUPPORTED_NETWORKS[chain]} alt={`${chain} icon`} />{" "}
        {chain}
      </NetworkButton>
    );
  });

  return (
    <Container ref={popoverRef} open={open}>
      <PopoverSection title="Networks">
        <NetworksContainer ref={scrollContainerRef} $overflow={overflow}>
          {networkButtons}
        </NetworksContainer>
      </PopoverSection>
    </Container>
  );
};

export default ChainSelectionPopover;
