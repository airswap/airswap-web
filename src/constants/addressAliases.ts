// Right now we only use an alias for the native address, but we could expand this
// to multiple addresses.
import nativeCurrency from "./nativeCurrency";

const nativeAddressAlias = "native";

export function transformAddressToAddressAlias(
  address?: string,
  chainId: number = 1
): string | undefined {
  if (!address) {
    return undefined;
  }

  if (address === nativeCurrency[chainId].address) {
    return nativeAddressAlias;
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

  if (address === nativeAddressAlias) {
    return nativeCurrency[chainId].address;
  }

  return address;
}
