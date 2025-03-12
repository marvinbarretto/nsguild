export function portableTextToPlainText(portableText: any[]): string {
    if (!Array.isArray(portableText)) return "";
  
    return portableText
      .map(block => block.children?.map((span: { text: string }) => span.text).join(" ") || "")
      .join(" ");
  }
  