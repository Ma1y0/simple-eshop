import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import type { Item } from "types/item";

export function meta({}: Route.MetaArgs) {
  return [{ title: "eshop" }, { name: "description", content: "Home page" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch(`/api/v1/invetory/`);
  const products = await res.json();
  return products.data as Item[];
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <div>
        {loaderData.map((x) => (
          <h2 key={x.id}>{x.name}</h2>
        ))}
      </div>
    </main>
  );
}
