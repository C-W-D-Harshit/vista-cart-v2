import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface OrderProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  slug: string;
  finalPrice?: number | null;
  totalPrice?: number | null;
}

interface OrderState {
  orderItem: OrderProduct | null; // Use a single item instead of an array
  orderTotalPrice: number;
  deliveryPrice: number; // Add a deliveryPrice property
  addToOrder: (product: OrderProduct) => void;
  clearOrder: () => void;
}

const useOrderStore = create<OrderState>()(
  devtools((set) => ({
    orderItem: null, // Initialize with no item in the order
    orderTotalPrice: 0,
    deliveryPrice: 40, // Set the default delivery price to 40
    addToOrder: (product) => {
      set((state) => {
        // Replace the existing order item with the newly added product
        const newOrderItem = product;

        // Calculate the new orderTotalPrice
        const newOrderTotalPrice =
          (newOrderItem.quantity || 0) * newOrderItem.price +
          state.deliveryPrice;

        return {
          orderItem: newOrderItem,
          orderTotalPrice: newOrderTotalPrice,
          deliveryPrice: state.deliveryPrice, // Preserve the delivery price
        };
      });
    },
    clearOrder: () => {
      set({
        orderItem: null, // Clear the order item
        orderTotalPrice: 0,
        deliveryPrice: 40, // Reset the delivery price when clearing the order
      });
    },
  }))
);

export default useOrderStore;
