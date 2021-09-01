import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

import { AnimatePresence } from "framer-motion";

import { SideBarNavButton } from "../../routes";
import Information from "../Content/Introduction";
import Organization from "../Content/Organization";
import Products from "../Content/Products";
import Icon from "../Icon/Icon";
import {
  StyledSideBar,
  ToggleButton,
  Navigation,
  ContentContainer,
  StyledNavButton,
} from "./SideBar.styles";

const content: Record<SideBarNavButton, FunctionComponent> = {
  introduction: Information,
  products: Products,
  organization: Organization,
};

type SideBarProps = {
  isOpen: boolean;
  setIsOpen?: () => void;
};

const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const [activeNavButton, setActiveNavButton] = useState<SideBarNavButton>(
    "introduction"
  );
  const { t } = useTranslation(["information"]);

  const buttons: SideBarNavButton[] = [
    "introduction",
    "products",
    "organization",
  ];

  return (
    <StyledSideBar isOpen={isOpen}>
      <Navigation>
        {buttons.map((button) => (
          <StyledNavButton
            key={button}
            primary={activeNavButton === button}
            onClick={() => setActiveNavButton(button)}
          >
            {/* @ts-ignore dynamic key */}
            {t(`information:nav_${button}`)}
          </StyledNavButton>
        ))}
      </Navigation>
      <AnimatePresence exitBeforeEnter>
        <ContentContainer
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: "0%" }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ ease: "easeOut" }}
          key={activeNavButton}
          style={{
            display: `${isOpen ? "none" : "block"}`,
          }}
        >
          {content[activeNavButton]({})}
        </ContentContainer>
      </AnimatePresence>
      <ToggleButton onClick={setIsOpen}>
        {isOpen ? (
          <Icon iconSize={0.5} name="arrow-left" />
        ) : (
          <Icon iconSize={0.5} name="arrow-right" />
        )}
      </ToggleButton>
    </StyledSideBar>
  );
};

export default SideBar;
