export type Item = {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  price: number | null;
  img_url: string | null;
  description: string | null;
};

export type InventoryResponse = {
  message: string;
  data: Item[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
