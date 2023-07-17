import { RefObject, useMemo } from "react";
import { useTranslation } from "react-i18next";

import nativeCurrency from "../../constants/nativeCurrency";
import {
  CHAIN_PARAMS,
  SUPPORTED_NETWORKS,
} from "../../constants/supportedNetworks";
import {
  Container,
  NetworksContainer,
  NetworkButton,
  NetworkIcon,
} from "./ChainSelectionPopover.styles";
import addAndSwitchToChain from "./helpers/addAndSwitchToChain";
import PopoverSection from "./subcomponents/PopoverSection/PopoverSection";

type ChainSelectionPopoverPropsType = {
  chainId: number;
  popoverRef: RefObject<HTMLDivElement>;
  className?: string;
};

const ChainSelectionPopover = ({
  chainId,
  popoverRef,
  className,
}: ChainSelectionPopoverPropsType) => {
  const { t } = useTranslation();

  const handleNetworkButtonClick = (chainId: number) => {
    addAndSwitchToChain(chainId);
  };

  const networkButtons = useMemo(() => {
    return SUPPORTED_NETWORKS.map((chain) => {
      return (
        <NetworkButton
          key={chain}
          $isActive={chainId === chain}
          onClick={() => handleNetworkButtonClick(chain)}
        >
          <NetworkIcon src={nativeCurrency[chain]?.logoURI} />
          {CHAIN_PARAMS[chain].chainName}
        </NetworkButton>
      );
    });
  }, [chainId]);

  return (
    <Container ref={popoverRef} className={className}>
      <PopoverSection title={t("common.networks")}>
        <NetworksContainer>{networkButtons}</NetworksContainer>
      </PopoverSection>
    </Container>
  );
};

export default ChainSelectionPopover;
