import { useRef, RefObject } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SUPPORTED_NETWORKS } from "../../constants/supportedNetworks";
import {
  selectWallet,
  setWalletConnected,
} from "../../features/wallet/walletSlice";
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
  const walletState = useAppSelector(selectWallet);
  console.log(useWeb3React<Web3Provider>());
  // console.log(chainId);

  const chainId = walletState.chainId;
  const address = walletState.address;

  const handleNetworkSwitch = (network: string) => {
    dispatch(
      setWalletConnected({
        address: address || "0x",
        chainId: SUPPORTED_NETWORKS[network].chainId,
      })
    );
    // update network
    // provider && provider.network = network;
  };

  const supportedNetworks = Object.keys(SUPPORTED_NETWORKS);

  const networkButtons = supportedNetworks.map((chain: string) => {
    return (
      <NetworkButton
        key={chain}
        $isActive={chainId?.toString() === chain}
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
