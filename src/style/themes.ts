import { DefaultTheme } from "styled-components/macro";

export const fontLoos = '"loos-normal", sans-serif';
export const fontMono = '"DM Mono", monospace';

const typography: DefaultTheme["typography"] = {
  title1: {
    desktop: {
      fontSize: "2rem",
      lineHeight: 1.167,
      fontWeight: 500,
    },
  },
  title2: {
    desktop: {
      fontSize: "1.5rem",
      lineHeight: 1.25,
      fontWeight: 700,
    },
    mobile: {
      fontSize: "1.25rem",
      lineHeight: 1.25,
      fontWeight: 700,
    },
  },
  title3: {
    desktop: {
      fontSize: "1.25rem",
      lineHeight: 1.25,
      fontWeight: 400,
    },
  },
  title4: {
    desktop: {
      fontSize: "1rem",
      lineHeight: 1.33,
      fontWeight: 700,
    },
  },
  subtitle: {
    desktop: {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontWeight: 700,
    },
  },
  paragraph: {
    desktop: {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontWeight: 400,
    },
  },
  infoHeading: {
    desktop: {
      fontSize: "1rem",
      lineHeight: 1.25,
      fontWeight: 600,
    },
    mobile: {
      fontSize: "1rem",
      lineHeight: 1.25,
      fontWeight: 600,
    },
  },
  infoSubHeading: {
    desktop: {
      fontSize: "1.0625rem",
      lineHeight: 1.25,
      fontWeight: 400,
    },
    mobile: {
      fontSize: "1rem",
      lineHeight: 1.25,
      fontWeight: 400,
    },
  },
  formLabel: {
    desktop: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
      fontWeight: 600,
    },
  },
  formInput: {
    desktop: {
      fontSize: "1.5rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
    mobile: {
      fontSize: "1.25rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
  },
  subText: {
    desktop: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
    mobile: {
      fontSize: "1rem",
      lineHeight: 1.5,
      fontWeight: 500,
    },
  },
  // Form select inputs
  selectItem: {
    desktop: {
      fontSize: "1.125rem",
      lineHeight: 1 + 1 / 3,
      fontWeight: 600,
    },
  },
  link: {
    desktop: {
      fontSize: "0.75rem",
      lineHeight: 2,
      fontWeight: 700,
    },
  },
  nav: {
    desktop: {
      fontSize: "1rem",
      lineHeight: 1.25,
      fontWeight: 400,
    },
  },
  small: {
    desktop: {
      fontSize: "0.875rem",
      lineHeight: 1.25,
      fontWeight: 500,
    },
    mobile: {
      fontSize: "1rem",
      lineHeight: 1.25,
      fontWeight: 500,
    },
  },
};

export const darkTheme: DefaultTheme = {
  name: "dark",
  colors: {
    primary: "#2B71FF",
    primaryDark: "#0752EB",
    primaryLight: "#F5F9FF",
    white: "#FFFFFF",
    alwaysWhite: "#FFFFFF",
    black: "#060607",
    alwaysBlack: "#060607",
    grey: "#404040",
    borderGrey: "#1A1E25",
    darkGrey: "#101217",
    lightGrey: "#6E7686",
    placeholderGrey: "#6E7686",
    red: "#FF0000",
    orange: "#E7765A",
    green: "#60FF66",
    placeholderGradient: "linear-gradient(270deg, #232833 0%, #2F364400 93.3%)",
    darkSubText: "#9EA3AC",
  },
  shadows: {
    widgetGlow: "0 0 31.25rem 1rem #2B71FF99",
    widgetGlowOff: "0 0 31.25rem 1rem #2B71FF22",
    buttonGlow: "0 0 2rem 0rem #2b71ff",
    buttonGlowFill: "#2b71ffdd",
    tooltipGlow: "0.25rem 0.25rem 0.625rem rgba(0, 0, 0, 0.5)",
    selectOptionsShadow: "0 0.25rem 1.75rem #000000",
  },
  typography,
};

export const lightTheme: DefaultTheme = {
  name: "light",
  colors: {
    primary: "#2B71FF",
    primaryDark: "#0752EB",
    primaryLight: "#F5F9FF",
    white: "#060607",
    alwaysWhite: "#FFFFFF",
    black: "#FFFFFF",
    alwaysBlack: "#000000",
    grey: "#404040",
    borderGrey: "#E7ECF3",
    darkGrey: "#9BA8C4",
    lightGrey: "#B3BCC9",
    placeholderGrey: "#9BA8C4",
    red: "#FF0000",
    orange: "#E7765A",
    green: "#60FF66",
    placeholderGradient: "linear-gradient(270deg, #E1EBFF 0%, #E1EBFF 93.3%)",
    darkSubText: "#9EA3AC",
  },
  shadows: {
    widgetGlow: "0 0 15.625rem 1rem rgba(255, 255, 255, 0.4)",
    widgetGlowOff: "0 0 31.25rem 1rem rgba(255, 255, 255, 0.1)",
    buttonGlow: "0 0 1rem 0rem #FFFFFF",
    buttonGlowFill: "#FFFFFF",
    tooltipGlow: "0.25rem 0.25rem 0.625rem rgba(255, 255, 255, 0.5)",
    selectOptionsShadow: "0 0.25rem 1.75rem #E7ECF3",
  },
  typography,
};
