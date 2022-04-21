// Right now we only use an alias for the native address, but we could expand this
// to multiple addresses depending on chain.

const nativeAddress = "0x0000000000000000000000000000000000000000";
const nativeAddressAlias = "native";

export function transformAddressToAddressAlias(
  address?: string
): string | undefined {
  if (!address) {
    return undefined;
  }

  if (address === nativeAddress) {
    return nativeAddressAlias;
  }

  return undefined;
}

export function transformAddressAliasToAddress(
  address?: string
): string | undefined {
  if (!address) {
    return undefined;
  }

  if (address === nativeAddressAlias) {
    return nativeAddress;
  }

  return address;
}
