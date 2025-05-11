import type { Route } from "./+types/register";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, Link, redirect, useNavigation } from "react-router";
import { Loader2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "eshop" },
    { name: "description", content: "Sign up for a new account" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!name || !email || !password) {
    console.error("Provide name, email and password");
    return { error: "Namem, email and password weren't provided" };
  }

  const res = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    console.error({ message, status: res.status });
    return { error: message, status: res.status };
  }

  return redirect("/login");
}

export default function Page({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="POST" className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="1234"
                required
              />
            </div>
            {navigation.state === "submitting" ? (
              <Button disabled className="w-full">
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Log In
              </Button>
            )}
          </Form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </div>
          {actionData?.error ?? (
            <div>
              <p className="text-red-300">{actionData?.error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
