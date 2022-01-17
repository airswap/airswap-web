export default function writeAddressToClipboard(
  address: string
): Promise<boolean> {
  return navigator.clipboard
    .writeText(address)
    .then(() => {
      return true;
    })
    .catch(() => {
      console.error("Async: Error copying address to clipboard");
      return false;
    });
}
