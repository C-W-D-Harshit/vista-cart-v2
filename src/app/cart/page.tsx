"use client";

import React, { Fragment } from "react";
import "@/styles/user/cart.scss";
import { Button, Separator } from "@radix-ui/themes";
import useCartStore from "@/store/cart";
import useStore from "@/store/store";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { it } from "node:test";

const Page = () => {
  const { clearCart, addToCart, removeFromCart } = useCartStore();
  const cartItems = useStore(useCartStore, (state) => state.cartItems);
  const cartNo = useStore(useCartStore, (state) => state.cartQuantity) ?? 0;
  const cart = useStore(useCartStore, (state) => state);
  return (
    <div className="cart">
      <h1>Your Cart Store</h1>
      {cartNo > 0 ? (
        <div className="cart_">
          <div>
            <div className="cart_table">
              <div>
                <p></p>
                <p>Product</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
              </div>
              <Separator size={"4"} />
              {cartItems?.map((item, i: number) => {
                return (
                  <Fragment key={i}>
                    <div>
                      <div>
                        <Link href={`/shop/${item.slug}`} className="cart_img">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                          />
                        </Link>
                      </div>
                      <p>{item.name}</p>
                      <p>₹{item.price}</p>
                      <div className="cart_counter">
                        <button
                          disabled={item.quantity === 0}
                          onClick={() => {
                            if (item.quantity > 1) {
                              addToCart({
                                productId: item.productId,
                                quantity: -1,
                                image: item.image,
                                name: item.name,
                                price: item.price,
                                stock: item.stock,
                                slug: item.slug,
                              });
                            } else {
                              removeFromCart(item.productId);
                            }
                          }}
                        >
                          <AiOutlineMinus />
                        </button>
                        <p>{item.quantity}</p>
                        <button
                          onClick={() => {
                            addToCart({
                              productId: item.productId,
                              quantity: 1,
                              image: item.image,
                              name: item.name,
                              price: item.price,
                              stock: item.stock,
                              slug: item.slug,
                            });
                          }}
                          disabled={
                            item.quantity > 9 || item.quantity === item.stock
                          }
                        >
                          <AiOutlinePlus />
                        </button>
                      </div>
                      <p>₹{item.totalPrice}</p>
                    </div>
                    <Separator size={"4"} />
                  </Fragment>
                );
              })}
            </div>
            <Button
              size={"2"}
              onClick={() => {
                clearCart();
              }}
              disabled={cartNo === 0}
              radius="full"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                <MdOutlineDeleteOutline />
              </div>
              <p>Clear Cart</p>
            </Button>
          </div>
          <div>
            <h2>Order Summery</h2>
            <div></div>
            <div className="cart_summary">
              <div>
                <p>Quantity</p>
                <p>{cart?.cartQuantity}</p>
              </div>
              <div>
                <p>Delivery</p>
                <p>₹40</p>
              </div>
              <div>
                <p>Subtotal</p>
                <p>₹{(cart?.cartTotalPrice as number) + 40}</p>
              </div>
            </div>
            <Separator size={"4"} />
            <div className="cart_tot">
              <p>Total</p>
              <p>₹{(cart?.cartTotalPrice as number) + 40}</p>
            </div>
            <button>Proceed To Checkout</button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            height: "70dvh",
          }}
        >
          <h1>Cart is Empty!</h1>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
