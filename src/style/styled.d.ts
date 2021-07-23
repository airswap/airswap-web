import "styled-components/macro";

type Typography =
  | "title1"
  | "title2"
  | "title3"
  | "title4"
  | "subtitle"
  | "paragraph"
  | "formLabel"
  | "formInput"
  | "nav"
  | "link"
  | "small";

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
      white: string;
      black: string;
      grey: string;
      darkGrey: string;
      lightGrey: string;
      red: string;
      orange: string;
      green: string;
    };
    typography: Record<Typography, FontProps>;
  }
}
