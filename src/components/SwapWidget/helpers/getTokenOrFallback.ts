import { UserTokenPair } from "../../../features/userSettings/userSettingsSlice";

export default function getTokenOrFallback(
  token: string | undefined,
  pairedToken: string | undefined,
  userToken: UserTokenPair["tokenTo"] | UserTokenPair["tokenFrom"],
  pairedUserToken: UserTokenPair["tokenTo"] | UserTokenPair["tokenFrom"],
  defaultTokenAddress: string | null,
  defaultPairedTokenAddress: string | null,
  customTokens: string[]
): string | null {
  if (token) {
    return token;
  }

  // If token doesn't exist then swap with paired token.
  if (pairedToken) {
    return null;
  }

  // Else get the user token from store (if it's not a custom token)
  if (userToken && !customTokens.includes(userToken)) {
    return userToken;
  }

  // Check if the paired token is not already the default token address
  if (pairedUserToken === defaultTokenAddress) {
    return defaultPairedTokenAddress;
  }

  return defaultTokenAddress;
}
