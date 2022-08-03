import "styled-components/macro";

type Typography =
  | "title1"
  | "title2"
  | "title3"
  | "title4"
  | "subtitle"
  | "paragraph"
  | "infoHeading"
  | "infoSubHeading"
  | "formLabel"
  | "formInput"
  | "selectItem"
  | "nav"
  | "link"
  | "small"
  | "subText";

type FontProps = {
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
};

declare module "styled-components" {
  export type ThemeType = "light" | "dark";
  export interface DefaultTheme {
    name: ThemeType;
    colors: {
      primary: string;
      primaryDark: string;
      primaryLight: string;
      white: string;
      alwaysWhite: string;
      black: string;
      alwaysBlack: string;
      grey: string;
      borderGrey: string;
      darkGrey: string;
      lightGrey: string;
      placeholderGrey: string;
      red: string;
      orange: string;
      green: string;
      placeholderGradient: string;
      darkSubText: string;
    };
    shadows: {
      widgetGlow: string;
      widgetGlowOff: string;
      buttonGlow: string;
      buttonGlowFill: string;
      tooltipGlow: string;
      selectOptionsShadow: string;
    };
    typography: Record<
      Typography,
      {
        desktop: FontProps;
        mobile?: FontProps;
      }
    >;
  }
}
