import { Suspense } from "react";
import { ThemeProvider } from "styled-components";
import { addDecorator } from "@storybook/react";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import { darkTheme, lightTheme } from "../src/style/themes";
import "../src/i18n/i18n";
import "../src/index.css";

addDecorator(withThemesProvider([darkTheme, lightTheme], ThemeProvider));

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
