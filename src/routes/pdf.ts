import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { htmlSchema } from "@/lib/schemas";
import { sanitizeHtmlInput } from "@/lib/utils";
import { generatePdf } from "@/lib/puppeteer";

const pdfRoute = new Hono();

pdfRoute.post("/generate", zValidator("json", htmlSchema), async (c) => {
  try {
    const { html } = c.req.valid("json");

    const sanitizedHtml = sanitizeHtmlInput(html);
    const pdfBuffer = await generatePdf(sanitizedHtml);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("PDF generation error:", error);

    if (error instanceof Error) {
      return c.json(
        {
          error: error.message,
          type: error.name,
        },
        500
      );
    }

    return c.json(
      {
        error: "PDF generation failed",
        type: "UnknownError",
      },
      500
    );
  }
});

export { pdfRoute };
