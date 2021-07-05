
export default function removeHTMLTag(string: string): string {
  return string.replace(/<\/?[^>]+>/g, '');
}