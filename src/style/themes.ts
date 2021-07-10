export interface ThemeProps {
  colors: {
    primary: string;
    primaryDark: string;
    white: string;
    black: string;
    grey: string;
    darkGrey: string;
    lightGrey: string;
  }
}

export const theme: ThemeProps = {
  colors: {
    primary: "#2B71FF",
    primaryDark: "#0F5FFF",
    white: "#FFF",
    black: "#060607",
    grey: "#404040",
    darkGrey: "#111215",
    lightGrey: "#C4C4C4",
  }
}
