export default async function writeAddressToClipboard(
  address: string
): Promise<boolean> {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    return false;
  }

  return await navigator.clipboard
    .writeText(address)
    .then(() => {
      return true;
    })
    .catch(() => {
      console.error("Async: Error copying address to clipboard");
      return false;
    });
}
