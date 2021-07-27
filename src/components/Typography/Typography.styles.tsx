import styled, {
  DefaultTheme,
  ThemedStyledFunction,
  css,
  FlattenSimpleInterpolation,
} from "styled-components/macro";

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
  formLabel: "label",
  formInput: "input",
  link: "a",
  nav: "div",
  small: "aside",
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
  additionalCSS?: FlattenSimpleInterpolation
) => {
  const tag = elementMap[key];
  const Component = (styled[tag] as ThemedStyledFunction<
    typeof tag,
    DefaultTheme,
    {},
    never
  >)`
    font-size: ${(props) => props.theme.typography[key].fontSize};
    font-weight: ${(props) => props.theme.typography[key].fontWeight};
    line-height: ${(props) => props.theme.typography[key].lineHeight};
    ${additionalCSS ? additionalCSS : ""}
  `;
  return Component;
};

export const StyledH1 = makeTypographyComponent("title1");
export const StyledH2 = makeTypographyComponent("title2");
export const StyledH3 = makeTypographyComponent("title3");
export const StyledH4 = makeTypographyComponent("title4");
export const StyledSubtitle = makeTypographyComponent(
  "subtitle",
  css`
    text-transform: uppercase;
  `
);
export const StyledParagraph = makeTypographyComponent("paragraph");
export const StyledFormLabel = makeTypographyComponent("formLabel");
export const StyledFormInput = makeTypographyComponent("formInput");
export const StyledLink = makeTypographyComponent(
  "link",
  css`
    text-transform: uppercase;
    text-decoration: underline;
  `
);
export const StyledNavigation = makeTypographyComponent("nav");
export const StyledMetadata = makeTypographyComponent("small");
