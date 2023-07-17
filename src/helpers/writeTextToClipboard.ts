export default async function writeTextToClipboard(
  text: string
): Promise<boolean> {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    return false;
  }

  return await navigator.clipboard
    .writeText(text)
    .then(() => {
      return true;
    })
    .catch(() => {
      console.error("Async: Error copying text to clipboard");
      return false;
    });
}
