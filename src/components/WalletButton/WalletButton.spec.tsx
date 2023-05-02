import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider } from "styled-components/macro";

import { darkTheme } from "../../style/themes";
import WalletButton from "./WalletButton";

describe("WalletButton", () => {
  // TODO: this doesn't work because of the `react-blockies` package - not
  // addressing this now due to potentially not using `react-blockies` when
  // designs are finalised.
  it.skip("should render a partial wallet address when provided", () => {
    const onConnectWalletClicked = jest.fn();
    render(
      <ThemeProvider theme={darkTheme}>
        <WalletButton
          isConnected={true}
          setShowWalletList={() => {}}
          setTransactionsTabOpen={() => {}}
          onDisconnectWalletClicked={() => {}}
          onConnectWalletClicked={onConnectWalletClicked}
          tokens={[]}
          transactions={[]}
          address={"0x73580000000000000000000000000000000bcBE5"}
          chainId={1}
        />
      </ThemeProvider>
    );

    userEvent.click(screen.getByText("0x7358…cBE5"));
    expect(onConnectWalletClicked).not.toHaveBeenCalled();
  });
});
