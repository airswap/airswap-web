export const compareAddresses = (
  address1: string,
  address2: string
): boolean => {
  return address1.toLowerCase() === address2.toLowerCase();
};

const floatRegExp = new RegExp("^([0-9])*[.,]?([0-9])*$");

export const sanitizeInput = (value: string): string | undefined => {
  if (value === "" || floatRegExp.test(value)) {
    if (value[value.length - 1] === ",")
      value = value.slice(0, value.length - 1) + ".";
    value = value.replace(/^0+/, "0");
    return value;
  }

  return undefined;
};
