import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface WishlistProduct {
  productId: string;
  // You can add more wishlist-specific fields here if needed
}

interface WishlistState {
  wishlistItems: WishlistProduct[];
  wishlistCount: number; // Add wishlistCount field
  addToWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const useWishlistStore = create<WishlistState>()(
  devtools(
    persist(
      (set) => ({
        wishlistItems: [],
        wishlistCount: 0, // Initialize wishlistCount
        addToWishlist: (product) => {
          set((state) => {
            const updatedWishlist = [...state.wishlistItems];
            const existingProductIndex = updatedWishlist.findIndex(
              (item) => item.productId === product.productId
            );
            if (existingProductIndex === -1) {
              updatedWishlist.push(product);
            }

            // Calculate the new wishlistCount
            const newWishlistCount = updatedWishlist.length;

            return {
              wishlistItems: updatedWishlist,
              wishlistCount: newWishlistCount,
            };
          });
        },
        removeFromWishlist: (productId) => {
          set((state) => {
            const updatedWishlist = state.wishlistItems.filter(
              (item) => item.productId !== productId
            );

            // Calculate the new wishlistCount after removing items
            const newWishlistCount = updatedWishlist.length;

            return {
              wishlistItems: updatedWishlist,
              wishlistCount: newWishlistCount,
            };
          });
        },
        clearWishlist: () => {
          set({ wishlistItems: [], wishlistCount: 0 }); // Reset wishlistCount
        },
      }),
      {
        name: "wishlistStore",
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
      }
    )
  )
);

export default useWishlistStore;
