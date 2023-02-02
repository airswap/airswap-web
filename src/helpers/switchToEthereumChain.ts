const switchToEthereumChain = () => {
  try {
    // @ts-ignore
    window.ethereum.request!({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: 1,
        },
      ],
    });
  } catch (e) {
    // unable to switch network, but doesn't matter too much as button
    // looks like a call to action in this case anyway.
  }
};

export default switchToEthereumChain;
