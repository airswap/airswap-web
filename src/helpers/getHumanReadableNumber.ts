import stringToSignificantDecimals from "./stringToSignificantDecimals";

export const getHumanReadableNumber: (
  input: string,
  numSigDecimals?: number,
  maxDigits?: number
) => string = (input, numSigDecimals = 2, maxDigits = 4) => {
  //auto sets to 2 decimals max, 4 digits
  const beforeDecimalPoint = input.split(".")[0];
  let readableNumber = "";
  let suffixTracker = 0;

  //check if anything before decimal needs to be added
  if (Number(beforeDecimalPoint) === 0) {
    //return decimal with 2 sig digits
    return stringToSignificantDecimals(input, numSigDecimals);

    //there are digits before the decimal
  } else {
    if (beforeDecimalPoint.length >= 10) {
      suffixTracker = 10;
    } else if (beforeDecimalPoint.length >= 7) {
      suffixTracker = 7;
    } else if (beforeDecimalPoint.length >= 4) {
      suffixTracker = 4;
    }
    //shorten substring if suffix is needed
    if (suffixTracker !== 0) {
      readableNumber = beforeDecimalPoint.substring(
        0,
        beforeDecimalPoint.length - (suffixTracker - (numSigDecimals - 1))
      );
      //check if after decimal is not 0
      if (
        beforeDecimalPoint[
          beforeDecimalPoint.length - (suffixTracker - (numSigDecimals - 1))
        ] !== "0"
      ) {
        //if its not 0 we include
        readableNumber += ".";
        readableNumber +=
          beforeDecimalPoint[
            beforeDecimalPoint.length - (suffixTracker - (numSigDecimals - 1))
          ];
        readableNumber +=
          beforeDecimalPoint[
            beforeDecimalPoint.length - (suffixTracker - numSigDecimals)
          ];
      }
      //no suffix is needed
    } else {
      readableNumber = input;
    }
    let numExtraZeros = 0;
    let decIndex = readableNumber.indexOf(".");
    //get to 4 sig digits
    if (
      readableNumber.length > maxDigits &&
      decIndex !== -1 &&
      decIndex < maxDigits
    ) {
      readableNumber = readableNumber.substring(0, maxDigits + 1);
    } else if (readableNumber.length > maxDigits) {
      if (decIndex !== -1) {
        numExtraZeros = decIndex - maxDigits;
      } else {
        numExtraZeros = readableNumber.length - maxDigits;
      }
      readableNumber = readableNumber.substring(0, maxDigits);
    }
    //if there are more than 3 digits after decimal trim
    if (
      decIndex !== -1 &&
      readableNumber.length - decIndex > numSigDecimals + 1
    ) {
      readableNumber = readableNumber.substring(0, readableNumber.length - 1);
    }

    //add extra zeroes if needed
    while (numExtraZeros > 0) {
      readableNumber += "0";
      numExtraZeros -= 1;
    }
    //add respective suffix
    if (suffixTracker === 10) {
      readableNumber += "B";
    } else if (suffixTracker === 7) {
      readableNumber += "M";
    } else if (suffixTracker === 4) {
      readableNumber += "k";
    }
  }
  return readableNumber;
};
