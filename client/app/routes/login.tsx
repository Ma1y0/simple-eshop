import type { Route } from "./+types/login";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, Link, redirect, useNavigation } from "react-router";
import { useActionData } from "react-router";
import { Loader2 } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "eshop" }, { name: "description", content: "Log In" }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  console.log("Called the action");
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    console.error("Provide email and password");
    return { error: "Email and password weren't provided" };
  }

  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    console.error({ message, status: res.status });
    return { error: message, status: res.status };
  }

  return redirect("/");
}

export default function Page({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-md rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            Log In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
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
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign up
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
