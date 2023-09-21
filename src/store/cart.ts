import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CartProduct {
  productId: string;
  quantity: number;
  finalPrice?: number | null;
}

interface CartState {
  cartItems: CartProduct[];
  cartQuantity: number; // Add cartQuantity field
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        cartItems: [],
        cartQuantity: 0, // Initialize cartQuantity
        addToCart: (product) => {
          set((state) => {
            const updatedCart = [...state.cartItems];
            const existingProductIndex = updatedCart.findIndex(
              (item) => item.productId === product.productId
            );
            if (existingProductIndex !== -1) {
              // If the product already exists in the cart, update its quantity and final price
              updatedCart[existingProductIndex].quantity += product.quantity;
              if (product.finalPrice !== undefined) {
                updatedCart[existingProductIndex].finalPrice =
                  product.finalPrice;
              }
            } else {
              // Otherwise, add it as a new item
              updatedCart.push(product);
            }

            // Calculate the new cartQuantity
            const newCartQuantity = updatedCart.reduce(
              (total, item) => total + item.quantity,
              0
            );

            return { cartItems: updatedCart, cartQuantity: newCartQuantity };
          });
        },
        removeFromCart: (productId) => {
          set((state) => {
            const updatedCart = state.cartItems.filter(
              (item) => item.productId !== productId
            );

            // Calculate the new cartQuantity after removing items
            const newCartQuantity = updatedCart.reduce(
              (total, item) => total + item.quantity,
              0
            );

            return { cartItems: updatedCart, cartQuantity: newCartQuantity };
          });
        },
        clearCart: () => {
          set({ cartItems: [], cartQuantity: 0 }); // Reset cartQuantity
        },
      }),
      { name: "cartStore" }
    )
  )
);

export default useCartStore;
