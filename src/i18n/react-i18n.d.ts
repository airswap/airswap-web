// import the original type declarations
import "react-i18next";

// import all namespaces (for the default language, only)
import balances from "../../public/locales/en/balances.json";
import common from "../../public/locales/en/common.json";
import wallet from "../../public/locales/en/wallet.json";
import orders from "../../public/locales/en/orders.json";

declare module "react-i18next" {
  // Extend with new types.
  interface Resources {
    balances: typeof balances;
    common: typeof common;
    wallet: typeof wallet;
    orders: typeof orders;
  }
}
