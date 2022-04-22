// Right now we only use an alias for the native address, but we could expand this
// to multiple addresses.
import nativeCurrency from "./nativeCurrency";

export function transformAddressToAddressAlias(
  address?: string,
  chainId: number = 1
): string | undefined {
  if (!address) {
    return undefined;
  }

  if (address === nativeCurrency[chainId].address) {
    return nativeCurrency[chainId].symbol.toLowerCase();
  }

  return undefined;
}

export function transformAddressAliasToAddress(
  address?: string,
  chainId: number = 1
): string | undefined {
  if (!address) {
    return undefined;
  }

  if (address === nativeCurrency[chainId].symbol.toLowerCase()) {
    return nativeCurrency[chainId].address;
  }

  return address;
}
