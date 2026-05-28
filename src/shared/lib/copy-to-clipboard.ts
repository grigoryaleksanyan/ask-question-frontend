export default async function copyToClipboard(
  textToCopy: string,
): Promise<void> {
  await navigator.clipboard.writeText(textToCopy);
}
