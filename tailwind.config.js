const colors = require("tailwindcss/colors");
module.exports = {
  // Tree-shake (remove) unused tailwind classes in production build
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  // See also DarkModeSwitch.tsx
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // AirSwap
      primary: {
        50: "#eaf1ff",
        100: "#d5e3ff",
        200: "#aac7ff",
        300: "#80aaff",
        400: "#558eff",
        500: "#2b72ff",
        DEFAULT: "#2b72ff", // AirSwap blue
        600: "#225bcc",
        700: "#1a4499",
        800: "#112e66",
        900: "#091733",
      },
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      green: colors.green,
      yellow: colors.amber,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
