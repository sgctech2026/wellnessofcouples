import { createFileRoute } from "@tanstack/react-router";
import { ProductDesireMen } from "./products";

export const Route = createFileRoute("/products/dsw")({
  head: () => ({
    meta: [
      { title: "Desire for Women, Daily Gummies for Mood, Energy & Connection" },
      {
        name: "description",
        content:
          "Desire for Women: clinically-backed daily gummies that help Filipino women feel lighter, more present, and more connected.",
      },
      { property: "og:title", content: "Desire for Women, Daily Gummies" },
      {
        property: "og:description",
        content: "Backed by research. Loved by Filipino women. 30-day money-back guarantee.",
      },
    ],
  }),
  component: () => <ProductDesireMen initialVariant="her" />,
});
