import { create } from "zustand";

type Cart = {
  items: Map<number, number>; // K = item id, V = amount
  addItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  removeItem: (id: number) => void;
};

export const useCart = create<Cart>((set) => ({
  items: new Map(),
  // Add/Increment
  addItem: (id) =>
    set((state) => {
      const newItems = new Map(state.items);
      newItems.set(id, (newItems.get(id) || 0) + 1);
      return { items: newItems };
    }),
  // Decrement/Remove
  decreaseItem: (id) =>
    set((state) => {
      const newItems = new Map(state.items);
      const currentQuantity = newItems.get(id);
      if (currentQuantity !== undefined) {
        if (currentQuantity > 1) {
          newItems.set(id, currentQuantity - 1);
        } else {
          // If quantity is 1, remove the item
          newItems.delete(id);
        }
      }
      return { items: newItems };
    }),
  // Remove
  removeItem: (id) =>
    set((state) => {
      const newItems = new Map(state.items);
      newItems.delete(id);
      return { items: newItems };
    }),
}));
