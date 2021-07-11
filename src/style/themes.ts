type Typography =
  'title1'
  | 'title2'
  | 'title3'
  | 'title4'
  | 'subtitle'
  | 'paragraph'
  | 'formLabel'
  | 'nav'
  | 'link'
  | 'small';

type FontProps = {
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
}

export interface ThemeProps {
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
  }
  typography: Record<Typography, FontProps>;
}

const typography: Record<Typography, FontProps> = {
  title1: {
    fontSize: '3rem',
    lineHeight: 1.167,
    fontWeight: 500,
  },
  title2: {
    fontSize: '2.5rem',
    lineHeight: 1.2,
    fontWeight: 500,
  },
  title3: {
    fontSize: '2rem',
    lineHeight: 1.25,
    fontWeight: 400,
  },
  title4: {
    fontSize: '1.5rem',
    lineHeight: 1.33,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: '1rem',
    lineHeight: 1.5,
    fontWeight: 700,
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  formLabel: {
    fontSize: '1rem',
    lineHeight: 1.5,
    fontWeight: 700,
  },
  link: {
    fontSize: '1rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  nav: {
    fontSize: '2rem',
    lineHeight: 1.25,
    fontWeight: 400,
  },
  small: {
    fontSize: '0.875rem',
    lineHeight: 1.71,
    fontWeight: 400,
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
    red: "#FF004D",
    orange: "#E7765A",
    green: "green",
  },
  typography,
}
