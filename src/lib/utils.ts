import sanitizeHtml from "sanitize-html";

export function sanitizeHtmlInput(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["style"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["style", "class"],
    },
    allowedStyles: {
      "*": {
        color: [/.*/],
        "text-align": [/.*/],
        "font-size": [/.*/],
        margin: [/.*/],
        padding: [/.*/],
      },
    },
  });
}
