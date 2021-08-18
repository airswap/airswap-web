const stringToSignificantDecimals: (
  input: string,
  sigDecimals?: number
) => string = (input, sigDecimals = 6) => {
  // Don't do anything if there's no decimal point.
  if (input.indexOf(".") === -1) {
    return input;
  }

  const [beforeDecimalPoint, afterDecimalPoint] = input.split(".");
  let trimmedDecimals = "";
  if (afterDecimalPoint.length <= sigDecimals) {
    // No need to trim
    trimmedDecimals = afterDecimalPoint;
  } else if (beforeDecimalPoint.match(/[1-9]/)) {
    // Number greater than zero, all decimal places significant:
    // just trim decimals to correct length
    trimmedDecimals = afterDecimalPoint.slice(0, 4);
  } else {
    // Number less than zero, some decimal places may not be significant
    let sigDecimalsRemaining = sigDecimals;
    let i = 0;
    let inLeadingZeroes = true;
    while (sigDecimalsRemaining > 0 && i < afterDecimalPoint.length - 1) {
      const currentDigit = afterDecimalPoint[i];
      trimmedDecimals += currentDigit;
      if (!inLeadingZeroes || currentDigit !== "0") {
        inLeadingZeroes = false;
        sigDecimalsRemaining--;
      }
      i++;
    }
  }

  return `${beforeDecimalPoint}.${trimmedDecimals}`;
};
export default stringToSignificantDecimals;
