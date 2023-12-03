import { RefObject, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { chainNames } from "@airswap/constants";

import { supportedNetworks } from "../../constants/supportedNetworks";
import nativeCurrency from "../../constants/nativeCurrency";
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
    return supportedNetworks.map(id => <NetworkButton
        key={id}
        $isActive={chainId === Number(id)}
        onClick={() => handleNetworkButtonClick(Number(id))}
      >
        <NetworkIcon src={`images/networks/${id}.png`} />
        {chainNames[id]}
      </NetworkButton>)
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
