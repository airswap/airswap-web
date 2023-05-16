import { useState, useEffect, useRef, RefObject } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "../../app/hooks";
import { SUPPORTED_NETWORKS } from "../../constants/supportedNetworks";
import useWindowSize from "../../hooks/useWindowSize";
import {
  Container,
  NetworksContainer,
  NetworkButton,
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
  const { width, height } = useWindowSize();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleNetworkSwitch = (network: string) => {
    // TODO: replace line below with a `setNetwork` from the Redux store
    // dispatch(setNetwork(network));
  };

  const supportedNetworks = Object.keys(SUPPORTED_NETWORKS);

  const networks = supportedNetworks.map((network: string) => {
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
      <PopoverSection title={t("common.theme")}>
        {/* TODO: replicate `LocaleContainer` code for NetworkContainer */}
        <NetworksContainer ref={scrollContainerRef} $overflow={overflow}>
          {supportedNetworks.map((network) => {
            return (
              <LocaleButton
                key={locale}
                $isActive={selectedLocale === locale}
                onClick={() => handleLocaleButtonClick(locale)}
              >
                {LOCALE_LABEL[locale]}
              </LocaleButton>
            );
          })}
        </NetworksContainer>

        {/*
        <LocaleContainer ref={scrollContainerRef} $overflow={overflow}>
          {SUPPORTED_LOCALES.map((locale) => {
            return (
              <LocaleButton
                key={locale}
                $isActive={selectedLocale === locale}
                onClick={() => handleLocaleButtonClick(locale)}
              >
                {LOCALE_LABEL[locale]}
              </LocaleButton>
            );
          })}
        </LocaleContainer>
        */}
      </PopoverSection>
    </Container>
  );
};

export default ChainSelectionPopover;
