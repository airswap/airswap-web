import { Suspense } from "react";
import { ThemeProvider } from "styled-components/macro";
import { addDecorator } from "@storybook/react";
import { withThemes } from "@react-theming/storybook-addon";
import { darkTheme, lightTheme } from "../src/style/themes";
import "../src/i18n/i18n";
import "../src/index.css";

const themingDecorator = withThemes(ThemeProvider, [darkTheme, lightTheme]);

addDecorator(themingDecorator);

export const onThemeSwitch = (context) => {
  const { theme } = context;

  const background = theme.name === "dark" ? "#060607" : "white";
  const parameters = {
    backgrounds: {
      default: background,
    },
  };
  return {
    parameters,
  };
};

// Suspense needed for i18n.
export const decorators = [
  (story, context) => {
    return (
      <Suspense fallback="Loading...">
        <div className="flex">{story(context)}</div>
      </Suspense>
    );
  },
];
