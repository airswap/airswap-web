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
  isWide?: boolean;
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
      darkBlue: string;
      white: string;
      alwaysWhite: string;
      black: string;
      alwaysBlack: string;
      grey: string;
      borderGrey: string;
      darkGrey: string;
      lightGrey: string;
      red: string;
      orange: string;
      green: string;
      placeholder: string;
      darkSubText: string;
      carteBlanche: string;
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
