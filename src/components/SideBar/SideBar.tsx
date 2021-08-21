import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import { NavLocation } from "../../routes";
import Information from "../Content/Introduction";
import Organization from "../Content/Organization";
import Products from "../Content/Products";
import Icon from "../Icon/Icon";
import {
  StyledSideBar,
  ToggleButton,
  Navigation,
  StyledLink,
  ContentContainer,
} from "./SideBar.styles";

const content: Record<NavLocation, FunctionComponent> = {
  swap: Information,
  introduction: Information,
  products: Products,
  organization: Organization,
};

type SideBarProps = {
  isOpen: boolean;
  setIsOpen?: () => void;
};

const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const { t } = useTranslation(["information"]);

  const match = useRouteMatch<{
    section?: NavLocation;
  }>();

  const allLocations: NavLocation[] = [
    "swap",
    "introduction",
    "products",
    "organization",
  ];

  const { section } = match.params;

  return (
    <StyledSideBar isOpen={isOpen}>
      <Navigation>
        {allLocations
          .filter((loc) => loc !== "swap")
          .map((loc) => (
            <StyledLink
              key={loc}
              to={loc}
              primary={
                section === loc ||
                (loc === "introduction" &&
                  (!section || !allLocations.includes(section)))
              }
            >
              {/* @ts-ignore dynamic key */}
              {t(`information:nav_${loc}`)}
            </StyledLink>
          ))}
      </Navigation>
      <AnimatePresence exitBeforeEnter>
        <ContentContainer
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: "0%" }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ ease: "easeOut" }}
          key={section || "introduction"}
          style={{
            display: `${isOpen ? "none" : "block"}`,
          }}
        >
          {section && content[section]
            ? content[section]({})
            : content["introduction"]({})}
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
