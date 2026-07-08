import { createFileRoute } from "@tanstack/react-router";
import { ProductDesireMen } from "./products";

export const Route = createFileRoute(
  "/products/desire-for-couple-2bottles-1-598-00",
)({
  head: () => ({
    meta: [
      { title: "Desire for Couple, 2-Bottle Bundle (₱1,598)" },
      {
        name: "description",
        content:
          "Desire for Couple: 1 Bottle Men + 1 Bottle Women for ₱1,598. Daily wellness gummies for Filipino couples.",
      },
      { property: "og:title", content: "Desire for Couple Bundle" },
      {
        property: "og:description",
        content: "Couple bundle: ₱1,598. Backed by research. 30-day money-back guarantee.",
      },
    ],
  }),
  component: () => <ProductDesireMen initialVariant="couple" />,
});
