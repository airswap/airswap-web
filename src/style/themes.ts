import { DefaultTheme } from "styled-components/macro";

const typography: DefaultTheme["typography"] = {
  title1: {
    fontSize: "2rem",
    lineHeight: 1.167,
    fontWeight: 500,
  },
  title2: {
    fontSize: "1.5rem",
    lineHeight: 1.2,
    fontWeight: 700,
  },
  title3: {
    fontSize: "1.25rem",
    lineHeight: 1.25,
    fontWeight: 400,
  },
  title4: {
    fontSize: "1rem",
    lineHeight: 1.33,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 700,
  },
  paragraph: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 400,
  },
  infoHeading: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 600,
  },
  infoSubHeading: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 400,
  },
  formLabel: {
    fontSize: "0.75rem",
    lineHeight: 1.5,
    fontWeight: 600,
  },
  formInput: {
    fontSize: "1.5rem",
    lineHeight: 1.5,
    fontWeight: 500,
  },
  // Form select inputs
  selectItem: {
    fontSize: "1.125rem",
    lineHeight: 1 + 1 / 3,
    fontWeight: 600,
  },
  link: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 400,
  },
  nav: {
    fontSize: "1rem",
    lineHeight: 1.25,
    fontWeight: 400,
  },
  small: {
    fontSize: "0.75rem",
    lineHeight: 1.71,
    fontWeight: 400,
  },
};

export const darkTheme: DefaultTheme = {
  name: "dark",
  colors: {
    primary: "#2B71FF",
    primaryDark: "#0F5FFF",
    white: "#FFFFFF",
    alwaysWhite: "#FFFFFF",
    black: "#060607",
    alwaysBlack: "#060607",
    grey: "#404040",
    borderGrey: "#1A1E25",
    darkGrey: "#101217",
    lightGrey: "#6E7686",
    red: "#FF004D",
    orange: "#E7765A",
    green: "#60FF66",
  },
  typography,
};

export const lightTheme: DefaultTheme = {
  name: "light",
  colors: {
    primary: "#2B71FF",
    primaryDark: "#101217",
    white: "#060607",
    alwaysWhite: "#FFFFFF",
    black: "#FFFFFF",
    alwaysBlack: "#000000",
    grey: "#404040",
    borderGrey: "#1A1E25",
    darkGrey: "#6E7686",
    lightGrey: "#6E7686",
    red: "#FF004D",
    orange: "#E7765A",
    green: "#60FF66",
  },
  typography,
};
