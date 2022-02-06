import styled, {
  DefaultTheme,
  ThemedStyledFunction,
  css,
  StyledComponent,
} from "styled-components/macro";

import breakPoints from "../../style/breakpoints";

const elementMap: Record<
  keyof DefaultTheme["typography"],
  keyof JSX.IntrinsicElements
> = {
  title1: "h1",
  title2: "h2",
  title3: "h3",
  title4: "h4",
  subtitle: "h5",
  paragraph: "p",
  infoHeading: "h4",
  infoSubHeading: "h4",
  formLabel: "label",
  formInput: "input",
  selectItem: "div",
  link: "a",
  nav: "div",
  small: "aside",
  subText: "h5",
};

/**
 * Creates a styled typography component for the key in `theme.typography`.
 * Element tag is defined above, and additional CSS can be added for properties
 * that are not common to all typography components.
 * @param key The key from `theme.typography` for typography params
 * @param additionalCSS Any additional CSS not included in `theme.typography.key`
 *                      to add, e.g. text-transform. Use `css` utility from
 *                      styled components to add it.
 * @returns A styled component with the correct typography styles appleid.
 */
const makeTypographyComponent = (
  key: keyof DefaultTheme["typography"],
  additionalCSS?: any
): StyledComponent<keyof JSX.IntrinsicElements, DefaultTheme> => {
  const tag = elementMap[key];
  const Component = (styled[tag] as ThemedStyledFunction<
    typeof tag,
    DefaultTheme,
    {},
    never
  >)`
    font-size: ${(props) => props.theme.typography[key].desktop.fontSize};
    font-weight: ${(props) => props.theme.typography[key].desktop.fontWeight};
    line-height: ${(props) => props.theme.typography[key].desktop.lineHeight};
    ${additionalCSS ? additionalCSS : ""}
    
    ${(props) =>
      props.theme.typography[key].mobile
        ? `
      @media ${breakPoints.phoneOnly} {
        font-size: ${props.theme.typography[key].mobile?.fontSize};
        font-weight: ${props.theme.typography[key].mobile?.fontWeight};
        line-height: ${props.theme.typography[key].mobile?.lineHeight};
      }`
        : ""}
  `;
  return Component;
};

export const StyledH1 = makeTypographyComponent(
  "title1",
  css`
    color: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.white
        : props.theme.colors.alwaysBlack};
  `
);
export const StyledH2 = makeTypographyComponent(
  "title2",
  css`
    color: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.white
        : props.theme.colors.primary};
  `
);
export const StyledH3 = makeTypographyComponent("title3");
export const StyledH4 = makeTypographyComponent("title4");
export const StyledSubtitle = makeTypographyComponent(
  "subtitle",
  css`
    text-transform: uppercase;
  `
);
export const StyledSubText = makeTypographyComponent(
  "subText",
  css`
    color: ${(props) => props.theme.colors.darkSubText};
  `
);
export const StyledParagraph = makeTypographyComponent(
  "paragraph",
  css`
    color: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.white
        : props.theme.colors.grey};
  `
);

export const StyledLink = makeTypographyComponent(
  "link",
  css`
    text-transform: uppercase;
    text-decoration: underline;
  `
) as StyledComponent<"a", DefaultTheme, {}>;

export const StyledNavigation = makeTypographyComponent("nav");
export const StyledInfoHeading = makeTypographyComponent("infoHeading");
export const StyledInfoSubHeading = makeTypographyComponent(
  "infoSubHeading",
  css`
    color: ${(props) => props.theme.colors.lightGrey};
  `
);
export const StyledFormLabel = makeTypographyComponent(
  "formLabel",
  css`
    color: ${({ theme }) =>
      theme.name === "dark" ? theme.colors.lightGrey : theme.colors.darkGrey};
  `
);
export const StyledFormInput = makeTypographyComponent(
  "formInput",
  css`
    color: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.white
        : props.theme.colors.primary};
    background-color: transparent;
    border: none;

    &::placeholder {
      color: ${(props) => props.theme.colors.placeholderGrey};
    }
  `
);
export const StyledSelectItem = makeTypographyComponent("selectItem");
export const StyledMetadata = makeTypographyComponent(
  "small",
  css`
    color: ${(props) => props.theme.colors.lightGrey};
  `
);
