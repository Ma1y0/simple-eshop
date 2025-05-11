import { useCart } from "~/lib/cart";
import type { Route } from "./+types/home";
import type { InventoryResponse } from "types/item";
import { useNavigate } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "eshop" }, { name: "description", content: "Home page" }];
}

export async function clientLoader(params: Route.ClientLoaderArgs) {
  const url = new URL(params.request.url);
  console.log("Fetching on: ", url.toString());
  const page = url.searchParams.get("page") ?? "1";
  const limit = url.searchParams.get("limit") ?? "8";

  const res = await fetch(`/api/v1/invetory/?page=${page}&limit=${limit}`);
  const response = await res.json();

  return response as InventoryResponse;
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { data: products, pagination } = loaderData;
  const cart = useCart();

  // Generate page array for pagination
  const maxPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? 1;

  const getPageRange = () => {
    const range = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(maxPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  const pageRange = getPageRange();

  const handlePageChange = (page: number) => {
    console.log("Redirect to page ", page);
    navigate(`?page=${page}&limit=${pagination.limit}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="font-medium">
            {Array.from(cart.items.values()).reduce(
              (sum, count) => sum + count,
              0
            )}{" "}
            items
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500">
              Please check back later for new inventory.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100 mb-4">
                  {product.img_url ? (
                    <img
                      src={product.img_url}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                  {product.description || "No description available"}
                </p>
                <p className="font-bold text-lg">
                  {product.price
                    ? `$${product.price / 100}`
                    : "Price not available"}
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                {cart.items.has(product.id) ? (
                  <div className="flex w-full items-center justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => cart.decreaseItem(product.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 font-medium">
                      {cart.items.get(product.id)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => cart.addItem(product.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => cart.addItem(product.id)}
                  >
                    Add to Cart
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
            )}

            {pageRange.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  to="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < maxPages && (
              <PaginationItem>
                <PaginationNext
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </main>
  );
}
