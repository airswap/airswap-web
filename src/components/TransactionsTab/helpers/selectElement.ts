export default function selectElement(element: HTMLDivElement): void {
  const selection = window.getSelection();
  const range = document.createRange();

  if (!selection) {
    return console.error("Error selecting element");
  }

  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}
