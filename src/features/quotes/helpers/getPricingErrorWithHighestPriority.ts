import { PricingErrorType } from "../../../errors/pricingError";

const errorPriority = {
  [PricingErrorType.unknown]: 0,
  [PricingErrorType.noServersFound]: 1,
  [PricingErrorType.noServerWalletFound]: 2,
  [PricingErrorType.noPricingFound]: 3,
  [PricingErrorType.noOrdersFound]: 4,
  [PricingErrorType.ordersExpired]: 5,
  [PricingErrorType.belowMinimumAmount]: 6,
  [PricingErrorType.formulaicPricingNotSupported]: 7,
};

/**
 * Get the pricing error with the highest relevance. For example, if LastLook has no servers found and RFQ has no pricing found, return no pricing found.
 * @param errors - The errors to get the highest relevance from (LastLook and RFQ)
 * @returns The pricing error with the highest relevance
 */
export const getPricingErrorWithHighestPriority = (
  errors: [PricingErrorType | undefined, PricingErrorType | undefined]
) => {
  const [firstError, secondError] = errors;
  const firstErrorPriority = firstError ? errorPriority[firstError] : -1;
  const secondErrorPriority = secondError ? errorPriority[secondError] : -1;

  return firstErrorPriority > secondErrorPriority ? firstError : secondError;
};
