import { motion } from "framer-motion";
import styled from "styled-components/macro";

import convertHexToRGBA from "../../helpers/transformHexToRgba";
import { sizes } from "../../style/sizes";
import CloseButton from "../../styled-components/CloseButton/CloseButton";
import { Title, InfoSubHeading } from "../Typography/Typography";

type ContainerProps = {
  isHidden: boolean;
  hasTitle: boolean;
};

export const ScrollContainer = styled.div`
  flex-grow: 99;
  height: 100%;
  max-height: calc(100% - 3.75rem);
  padding-bottom: ${sizes.tradeContainerPadding};

  &::-webkit-scrollbar {
    width: 0.5rem;
    background: ${(props) => props.theme.colors.black};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.white};
    border-radius: 0.5rem;
  }
`;

export const ContentContainer = styled(motion.div)`
  position: relative;
  height: calc(100% - 5.625rem);
  padding: 0 ${sizes.tradeContainerPadding};
  background-color: ${(props) => props.theme.colors.black};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${sizes.tradeContainerPadding};
  transition: background ease-in-out 0.3s;
`;

export const TitleSubContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledTitle = styled(Title)`
  min-height: 1.875rem;
  padding-right: 1rem;
  flex-grow: 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity ease-in-out 0.3s;
  will-change: opacity;
`;

export const StyledSubTitle = styled(InfoSubHeading)`
  transition: opacity ease-in-out 0.3s;
  will-change: opacity;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 1rem;
`;

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: ${(props) => (props.isHidden ? "none" : "visible")};
  z-index: 2;
  
  ${CloseButton} {
    transition: transform ${(props) =>
      props.isHidden
        ? "0.25s ease-in"
        : "0.75s cubic-bezier(0.12, 0.71, 0.36, 1)"};
    transform: translateY(${(props) => (props.isHidden ? "-5rem" : "0%")});

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
  
  ${StyledTitle} {
    opacity: ${(props) => (props.isHidden ? 0 : 1)};
    pointer-events: ${(props) => (props.isHidden ? "none" : "visible")};
    
    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
  
  ${TitleContainer} {
    background: ${(props) =>
      props.isHidden || !props.hasTitle
        ? convertHexToRGBA(props.theme.colors.black, 0)
        : props.theme.colors.black};
  }
}
`;
