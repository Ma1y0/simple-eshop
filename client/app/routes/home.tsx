import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main>
      <h1>Hello</h1>
      <Button
        onClick={async () => {
          const res = await fetch("/api/v1/user/me");
          console.log(await res.json());
        }}
      >
        Click Me!
      </Button>
      <Button
        variant={"destructive"}
        onClick={async () => {
          await fetch("/api/v1/auth/logout", { method: "POST" });
        }}
      >
        Log Out
      </Button>
    </main>
  );
}
