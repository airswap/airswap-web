import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WalletButton from "./WalletButton";

describe("WalletButton", () => {
  it("should render connect wallet button when no address is provided", () => {
    const onConnectWalletClicked = jest.fn();
    render(<WalletButton onConnectWalletClicked={onConnectWalletClicked} />);
    userEvent.click(screen.getByText("wallet:connectWallet"));
    expect(onConnectWalletClicked).toHaveBeenCalled();
  });

  // TODO: this doesn't work because of the `react-blockies` package - not
  // addressing this now due to potentially not using `react-blockies` when
  // designs are finalised.
  it.skip("should render a partial wallet address when provided", () => {
    const onConnectWalletClicked = jest.fn();
    render(
      <WalletButton
        onConnectWalletClicked={onConnectWalletClicked}
        address={"0x73580000000000000000000000000000000bcBE5"}
      />
    );

    userEvent.click(screen.getByText("0x7358…cBE5"));
    expect(onConnectWalletClicked).not.toHaveBeenCalled();
  });
});
