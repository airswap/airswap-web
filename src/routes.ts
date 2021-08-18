type PageRoute = {
  path: string;
  label: string;
};

export type NavLocation = "swap" | "introduction" | "products" | "organization";

export const routes: PageRoute[] = [
  {
    path: "/",
    label: "Swap",
  },
  {
    path: "/introduction",
    label: "Introduction",
  },
  {
    path: "/products",
    label: "Products",
  },
  {
    path: "/organizations",
    label: "Orginization",
  },
];
