"use client";

import useCartStore from "@/store/cart";
import "@/styles/components/productcard.scss";
import { Button } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { BsCart4 } from "react-icons/bs";

const ProductCard = ({ product }: { product: any }) => {
  const { addToCart } = useCartStore();
  return (
    <div className="productcard">
      <Link href={`/shop/${product.slug}`}>
        <div className="productcard_img">
          <Image
            src={product.images[0].url || "/de.png"}
            width={600}
            height={600}
            alt={product.name}
          />
        </div>
      </Link>

      <div className="productcard_">
        <div>
          <p>{product.name}</p>
          <p>₹{product.price}</p>
        </div>
        <Button
          onClick={() => {
            addToCart({
              productId: product._id,
              quantity: 1,
              //   finalPrice: 15.99, // Optional final price
            });
            toast.success("Added to cart!");
          }}
          radius="full"
        >
          <p
            style={{
              fontSize: "2rem",
              cursor: "pointer",
            }}
          >
            <BsCart4 />
          </p>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
