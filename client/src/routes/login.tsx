import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-md rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            Log In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
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
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
