import { createFileRoute } from "@tanstack/react-router";
import { ProductDesireMen } from "./products";

export const Route = createFileRoute("/products/desire-for-men")({
  head: () => ({
    meta: [
      { title: "Desire for Men, Daily Gummies for Drive, Stamina & Connection" },
      {
        name: "description",
        content:
          "Desire for Men: clinically-backed daily gummies trusted by 3,500+ Filipino couples to feel closer, more passionate, and more connected.",
      },
      { property: "og:title", content: "Desire for Men, Daily Gummies" },
      {
        property: "og:description",
        content: "Backed by research. Validated by real couples. 30-day money-back guarantee.",
      },
    ],
  }),
  component: () => <ProductDesireMen initialVariant="him" />,
});
