export const parseJsonArray = <T>(value: string): T[] => {
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error("Error parsing JSON");

    return [];
  }
};

export const parseJsonObject = <T>(value: string): T => {
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error("Error parsing JSON");

    return {} as T;
  }
};

export const getUniqueArrayChildren = <T>(array: T[], key: string): T[] => [
  // @ts-ignore
  ...new Map(array.map((item: any) => [item[key], item])).values(),
];
