import switchToChain from "./switchToChain";

const switchToEthereumChain = () => {
  try {
    switchToChain(1);
  } catch (e) {
    // unable to switch network, but doesn't matter too much as button
    // looks like a call to action in this case anyway.
  }
};

export default switchToEthereumChain;
