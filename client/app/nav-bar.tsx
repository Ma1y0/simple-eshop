import { Link } from "react-router";
import { ShoppingCart, User, LogIn, LogOut, Home } from "lucide-react";
import { useAuth } from "./lib/auth";
import { useCart } from "./lib/cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { useEffect } from "react";

export function NavBar() {
  const { user, logout, fetchUser } = useAuth();
  const { items } = useCart();

  useEffect(() => {
    fetchUser();
  }, []);

  // Calculate total items in cart
  const cartItemCount = Array.from(items.values()).reduce(
    (total, quantity) => total + quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-5 justify-between">
        <div className="flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className=" font-bold">Eshop</span>
          </Link>
        </div>

        {/* <div className="flex-1" /> */}

        <div className="flex">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="relative mr-2"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>

          {/* Authentication Section */}
          <div className="flex items-center space-x-1">
            {user ? (
              // Logged in: Show Avatar with dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.avatarURL ? (
                        <AvatarImage src={user.avatarURL} alt={user.name} />
                      ) : (
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Not logged in: Show login/register buttons
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log in
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
