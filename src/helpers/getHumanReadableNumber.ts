export const getHumanReadableNumber: (input: string) => string = (input) => {
  const [beforeDecimalPoint, afterDecimalPoint] = input.split(".");
  //sets to 2 sig digits after decimal if nothing before decimal
  //and (numSigDigits -1) = 1 sig digit after decimal
  //if there is sig digit in front of decimal
  const numSigDigits = 2;
  const maxDigits = 4;
  let readableNumber = "";
  let suffixTracker = 0;

  //check if anything before decimal needs to be added
  if (Number(beforeDecimalPoint) === 0) {
    //if there is nothing before decimal point check if anything after decimal point
    //needs to be rounded 2 sig digits
    let sigDigit = afterDecimalPoint[0];
    let iter = 0;
    //iterate until first significant digit
    while (sigDigit == "0") {
      iter += 1;
      sigDigit = afterDecimalPoint[iter];
    }
    //do nothing if no trimming is needed
    if (afterDecimalPoint.length - (iter + 1) < numSigDigits) {
      return input;
    }
    //else have to trim
    else {
      readableNumber =
        beforeDecimalPoint +
        "." +
        afterDecimalPoint.substring(0, iter + numSigDigits);
      return readableNumber;
    }
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
        beforeDecimalPoint.length - (suffixTracker - (numSigDigits - 1))
      );
      if (
        beforeDecimalPoint[
          beforeDecimalPoint.length - (suffixTracker - (numSigDigits - 1))
        ] !== "0"
      ) {
        readableNumber += ".";
        readableNumber +=
          beforeDecimalPoint[
            beforeDecimalPoint.length - (suffixTracker - (numSigDigits - 1))
          ];
        readableNumber +=
          beforeDecimalPoint[
            beforeDecimalPoint.length - (suffixTracker - numSigDigits)
          ];
      }
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
