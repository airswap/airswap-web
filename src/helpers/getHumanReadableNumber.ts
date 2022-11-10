export const getHumanReadableNumber: (input: string) => string = (input) => {
  const [beforeDecimalPoint, afterDecimalPoint] = input.split(".");
  //sets to 2 sig digits after decimal if nothing before decimal
  //and (numSigDigits -1) = 1 sig digit after decimal
  //if there is sig digit in front of decimal
  const numSigDigits = 2;
  let readableNumber = "";

  //check if there is anything before decimal point
  if (beforeDecimalPoint.length < 4 || Number(beforeDecimalPoint) == 0) {
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
  } else {
    //first check to see if M is needed
    if (beforeDecimalPoint.length >= 7) {
      readableNumber = beforeDecimalPoint.substring(
        0,
        beforeDecimalPoint.length - (7 - (numSigDigits - 1))
      );
      //check if after decimal point is significant
      if (
        beforeDecimalPoint[
          beforeDecimalPoint.length - (7 - (numSigDigits - 1))
        ] !== "0"
      ) {
        readableNumber += ".";
        readableNumber +=
          beforeDecimalPoint[
            beforeDecimalPoint.length - (7 - (numSigDigits - 1))
          ];
      }
      readableNumber += "M";
      return readableNumber;
    }
    //now check if k is needed
    if (beforeDecimalPoint.length >= 4) {
      readableNumber = beforeDecimalPoint.substring(
        0,
        beforeDecimalPoint.length - (4 - (numSigDigits - 1))
      );
      //check if after decimal point is significant
      if (
        beforeDecimalPoint[
          beforeDecimalPoint.length - (4 - (numSigDigits - 1))
        ] !== "0"
      ) {
        readableNumber += ".";
        readableNumber +=
          beforeDecimalPoint[
            beforeDecimalPoint.length - (4 - (numSigDigits - 1))
          ];
      }
      readableNumber += "k";
      return readableNumber;
    }
  }

  return input;
};
