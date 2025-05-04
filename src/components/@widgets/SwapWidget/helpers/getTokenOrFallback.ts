import { UserTokenPair } from "../../../../features/userSettings/userSettingsSlice";

export default function getTokenOrFallback(
  token: string | undefined,
  pairedToken: string | undefined,
  pairedUserToken: UserTokenPair["tokenTo"] | UserTokenPair["tokenFrom"],
  defaultTokenAddress: string | null,
  defaultPairedTokenAddress: string | null
): string | null {
  if (token) {
    return token;
  }

  // If token doesn't exist then swap with paired token.
  if (pairedToken) {
    return null;
  }

  // Check if the paired token is not already the default token address
  if (pairedUserToken?.address === defaultTokenAddress) {
    return defaultPairedTokenAddress;
  }

  return defaultTokenAddress;
}
