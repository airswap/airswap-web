export const customStringToSignificantDecimals: (
  input: string,
  sigDecimals?: number
) => string = (input, sigDecimals = 6) => {
  // DIFF w/ main helper: added single decimal to whole numbers
  if (input.indexOf(".") === -1) {
    return `${input}.0`;
  }

  const [beforeDecimalPoint, afterDecimalPoint] = input.split(".");
  let trimmedDecimals = "";
  if (afterDecimalPoint.length <= sigDecimals) {
    trimmedDecimals = afterDecimalPoint;
  } else if (beforeDecimalPoint.match(/[1-9]/)) {
    // DIFF w/ main helper: trims to sigDecimals, not 4
    trimmedDecimals = afterDecimalPoint.slice(0, sigDecimals);
  } else {
    let sigDecimalsRemaining = sigDecimals;
    let i = 0;
    let inLeadingZeroes = true;
    // DIFF w/ main helper: afterDecimalPoint.length - 1 cut off string before sigDecimal
    while (sigDecimalsRemaining > 0 && i < afterDecimalPoint.length) {
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
