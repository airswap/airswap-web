function writeAddressToNavigatorClipboard(address: string): Promise<boolean> {
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

function writeAddressToClipboardLegacy(
  address: string,
  node?: HTMLDivElement
): boolean {
  const selection = window.getSelection();
  const range = document.createRange();

  if (!selection || !node) {
    console.error("Error copying address to clipboard");
    return false;
  }

  node.textContent = address;
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();

  return true;
}

export default async function writeAddressToClipboard(
  address: string,
  /**
   * Optional node is needed for navigator.clipboard fallback. Metamask on android doesn't support this yet.
   */
  node?: HTMLDivElement
): Promise<boolean> {
  if (!navigator.clipboard) {
    return writeAddressToClipboardLegacy(address, node);
  }

  return await writeAddressToNavigatorClipboard(address);
}
