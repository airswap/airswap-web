import { useState, useEffect, useRef, RefObject } from "react";

import { useAppDispatch } from "../../app/hooks";
import { SUPPORTED_NETWORKS } from "../../constants/supportedNetworks";
import useWindowSize from "../../hooks/useWindowSize";
import { Container } from "./ChainSelectionPopover.styles";

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
  const { width, height } = useWindowSize();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleNetworkSwitch = (network: string) => {
    // TODO: replace line below with a `setNetwork` from the Redux store
    // dispatch(setNetwork(network));
  };

  const networks = SUPPORTED_NETWORKS.map((network: string) => {
    return (
      <ul key={network}>
        <li>{network}</li>
      </ul>
    );
  });

  console.log(networks);

  // TODO: is code below necessary for chainSelection?
  // useEffect(() => {
  //   if (popoverRef.current && scrollContainerRef.current) {
  //     const { offsetTop, scrollHeight } = scrollContainerRef.current;
  //     setOverflow(scrollHeight + offsetTop > popoverRef.current.offsetHeight);
  //   }
  // }, [popoverRef, scrollContainerRef, width, height]);

  return (
    <Container ref={popoverRef} open={open}>
      {networks}
    </Container>
  );
};

export default ChainSelectionPopover;
