import { UnknownToken } from "./UnknownToken";

export const isUnknownToken = (
  unknownToken: any
): unknownToken is UnknownToken => {
  return (
    typeof unknownToken === "object" &&
    unknownToken !== null &&
    "chainId" in unknownToken &&
    "address" in unknownToken &&
    !("name" in unknownToken)
  );
};
