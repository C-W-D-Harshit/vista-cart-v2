"use client";

import useCartStore from "@/store/cart";
import "@/styles/user/productdetails.scss";
import { Button } from "@radix-ui/themes";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import ReactStars from "react-rating-star-with-type";
import { useStore } from "zustand";
import { useState } from "react";
import { BiCartAdd, BiHeart } from "react-icons/bi";
import { FaExclamationCircle, FaShoppingCart } from "react-icons/fa";
import { BsHandbagFill } from "react-icons/bs";
import useWishlistStore from "@/store/wishlist";
import { MdDelete } from "react-icons/md";
import useOrderStore from "@/store/order";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const InfoComp = ({ data }: { data: any }) => {
  const router = useRouter();
  const { data: session }: { data: any } = useSession();
  const cart = useStore(useCartStore, (state) => state.cartItems);
  const [c, setC] = useState(false);

  const { addToCart, removeFromCart } = useCartStore();
  const { addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addToOrder } = useOrderStore();
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const [wish, setWish] = useState(false);

  // Function to check if a product is in the wishlist
  const isProductInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId);
  };
  let item = cart.find((item) => item.productId === data.product.id);
  let quan = item ? item.quantity : 1;

  function updateQuantityOnClick() {
    item = cart.find((item) => item.productId === data.product.id);
    quan = item ? item.quantity : 1;
  }

  const [quantity, setQuantity] = useState(1);

  const stock = data.product.stock - 10;

  // buy now
  const handleBuyNow = () => {
    // addToOrder({
    //   image: data.product.images[0].url,
    //   name: data.product.name,
    //   price: data.product.price,
    //   quantity: 1,
    //   productId: data.product.id,
    //   slug: data.product.slug,
    // });
    // console.log(session);
    if (session && session.user.verified) {
      router.push(`/checkout?ref=buyNow&&product=${data.product.slug}`);
    } else {
      toast.error("Please verify your email first!");
    }
  };
  return (
    <div className="productDetails_info">
      <p className="productDetails_brand">{data.product.brand}</p>
      <p className="productDetails_name">{data.product.name}</p>
      <p className="productDetails_desc">{data.product.description}</p>
      <div className="productDetails_ratings">
        <ReactStars
          value={data.product.ratings}
          activeColors={["red", "orange", "#FFCE00", "#9177FF", "#8568FC"]}
          isEdit={false}
          size={20}
        />
        <span>({data.product.numOfReviews} reviews)</span>
      </div>
      <p className="productDetails_price">₹{data.product.price}</p>
      <div className="productDetails_counter">
        <div>
          <button
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity === 1}
          >
            <AiOutlineMinus />
          </button>
          <p>{quantity}</p>
          <button
            onClick={() => {
              setQuantity(quantity + 1);
            }}
            disabled={stock === quantity || quantity > 10}
          >
            <AiOutlinePlus />
          </button>
        </div>
        {c ? (
          <Button
            size={"3"}
            variant="outline"
            color="crimson"
            onClick={() => {
              removeFromCart(data.product.id);
              setC(false);
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              <MdDelete />
            </div>
            <p>Remove From Cart</p>
          </Button>
        ) : (
          <Button
            size={"3"}
            onClick={() => {
              updateQuantityOnClick();
              setC(true);
              addToCart({
                productId: data.product.id,
                quantity,
                image: data.product.images[0].url,
                name: data.product.name,
                price: data.product.price,
                stock,
                slug: data.product.slug,
              });
            }}
            disabled={quantity > 10 || quantity === stock || quan === stock}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              <BiCartAdd />
            </div>
            <p>Add To Cart</p>
          </Button>
        )}
      </div>
      <div className="productDetails_btn">
        <Button
          size={"4"}
          radius="full"
          variant="classic"
          disabled={stock < 1}
          onClick={handleBuyNow}
        >
          {stock > 1 ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                <BsHandbagFill />
              </div>
              <p>Buy Now</p>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                <FaExclamationCircle />
              </div>
              <p>Out Of Stock</p>
            </>
          )}
        </Button>
      </div>
      <div className="productDetails_btn">
        <Button
          size={"3"}
          onClick={() => {
            setWish(!wish);
            if (isProductInWishlist(data.product.id)) {
              removeFromWishlist(data.product.id);
            } else {
              addToWishlist({
                productId: data.product.id,
              });
            }
          }}
          //   disabled={isProductInWishlist(data.product.id)}
          color="crimson"
          variant={isProductInWishlist(data.product.id) ? "outline" : "solid"}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            <BiHeart />
          </div>
          <p>
            {isProductInWishlist(data.product.id)
              ? "Remove From Wishlist"
              : "Add To Wishlist"}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default InfoComp;
