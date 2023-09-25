import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface CartProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  slug: string;
  finalPrice?: number | null;
  totalPrice?: number | null;
}

interface CartState {
  cartItems: CartProduct[];
  cartQuantity: number;
  cartTotalPrice: number;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        cartItems: [],
        cartQuantity: 0,
        cartTotalPrice: 0,
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

            // Update total price for individual products and calculate the new cartQuantity and cartTotalPrice
            let newCartQuantity = 0;
            let newCartTotalPrice = 0;
            updatedCart.forEach((item) => {
              item.totalPrice = item.quantity * item.price;
              newCartQuantity += item.quantity;
              newCartTotalPrice += item.totalPrice;
            });

            if (newCartQuantity > 15) {
              console.log("Only 15 products can be added to cart");
              toast.error("Only 15 products can be added to cart");
              return state; // Prevent further changes to the cart
            }

            return {
              cartItems: updatedCart,
              cartQuantity: newCartQuantity,
              cartTotalPrice: newCartTotalPrice,
            };
          });
        },
        removeFromCart: (productId) => {
          set((state) => {
            const updatedCart = state.cartItems.filter(
              (item) => item.productId !== productId
            );

            // Calculate the new cartQuantity and cartTotalPrice after removing items
            let newCartQuantity = 0;
            let newCartTotalPrice = 0;
            updatedCart.forEach((item) => {
              newCartQuantity += item.quantity;
              newCartTotalPrice += item.totalPrice || 0;
            });

            return {
              cartItems: updatedCart,
              cartQuantity: newCartQuantity,
              cartTotalPrice: newCartTotalPrice,
            };
          });
        },
        clearCart: () => {
          set({
            cartItems: [],
            cartQuantity: 0,
            cartTotalPrice: 0,
          });
        },
      }),
      {
        name: "cartStore",
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
      }
    )
  )
);

export default useCartStore;
