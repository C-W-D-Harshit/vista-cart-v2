"use client";

import "@/styles/user/checkout.scss";
import { useForm } from "react-hook-form";
import { addressSchema } from "../../../../zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import OrderCard from "./OrderCard";
import { Button, Separator } from "@radix-ui/themes";
import useStore from "@/store/store";
import useCartStore from "@/store/cart";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Checkout = ({
  refral,
  data,
}: {
  refral: string;
  data: any | undefined;
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<addressSchema>({
    resolver: zodResolver(addressSchema),
  });
  const { data: session }: { data: any } = useSession();
  useMemo(() => {
    if (!session?.user) return null;

    reset({
      name: session?.user.name,
      email: session?.user.email,
    });
  }, [session?.user, reset]);
  const cartItems: any = useStore(useCartStore, (state) => state.cartItems);
  const cart = useStore(useCartStore, (state) => state);
  const { clearCart } = useCartStore();

  const gg = async (formData: any) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
    let data;
    try {
      const { data } = await axios.post(`/api/order`, formData);
      router.replace(
        `/order-complete?orderId=${data.order._id}&paymentId=${data.order.paymentID}`
      );
      if (refral === "addToCart") {
        clearCart();
      }
    } catch (error: any) {
      throw new Error(error.message);
    }

    return data;
  };
  const onSubmit = async (dat: any) => {
    const address = { ...dat };
    let formData = {};
    if (refral === "buyNow") {
      formData = {
        products: [
          {
            productId: data.id,
          },
        ],
        address,
        userID: session.user.id,
        totalPrice: data.price + 40,
      };
      console.log(formData);
    } else {
      formData = {
        products: cartItems,
        address,
        userID: session.user.id,
        totalPrice: (cart?.cartTotalPrice as number) + 40,
      };
      console.log(formData);
    }
    const fg: any = gg(formData);
    toast.promise(
      fg
        .then((result: any) => {
          // Handle success
          return result; // Pass the result to the success callback
        })
        .catch((error: any) => {
          // Handle error and get the error message
          console.error(error.message);
          return Promise.reject(error); // Pass the error to the error callback
        }),
      {
        loading: "Creating your order...",
        error: (error) => {
          // Display the error message using toast.error
          // toast.error(error.message);
          return error.message; // Return the error message
        },
        success: "Order Created....",
      }
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="checkout">
        <div>
          <div className="addressForm">
            <p>Shipping Address</p>
            <div className="checkout_input">
              {errors.name ? (
                <p className="checkout_err">{errors.name.message}</p>
              ) : (
                <p>Full name</p>
              )}
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("name")}
              />
            </div>
            <div className="checkout_2">
              <div className="checkout_input">
                {errors.email ? (
                  <p className="checkout_err">{errors.email.message}</p>
                ) : (
                  <p>Email</p>
                )}
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
              </div>
              <div className="checkout_input">
                {errors.phoneNumber ? (
                  <p className="checkout_err">{errors.phoneNumber.message}</p>
                ) : (
                  <p>Phone Number</p>
                )}
                <input
                  type="number"
                  placeholder="Enter your phone number"
                  {...register("phoneNumber", { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="checkout_input">
              {errors.address ? (
                <p className="checkout_err">{errors.address.message}</p>
              ) : (
                <p>Address</p>
              )}
              <input
                type="text"
                placeholder="Enter your street name and house number"
                {...register("address")}
              />
            </div>
            <div className="checkout_2">
              <div className="checkout_input">
                {errors.city ? (
                  <p className="checkout_err">{errors.city.message}</p>
                ) : (
                  <p>City</p>
                )}
                <input type="text" placeholder="City" {...register("city")} />
              </div>
              <div className="checkout_input">
                {errors.state ? (
                  <p className="checkout_err">{errors.state.message}</p>
                ) : (
                  <p>State</p>
                )}
                <input type="text" placeholder="State" {...register("state")} />
              </div>
            </div>
            <div className="checkout_input">
              {errors.postalCode ? (
                <p className="checkout_err">{errors.postalCode.message}</p>
              ) : (
                <p>Postal Code</p>
              )}
              <input
                type="number"
                placeholder="Enter your postal code"
                {...register("postalCode", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
        {refral === "buyNow" ? (
          <div className="checkout_">
            <p>Your Order</p>

            <OrderCard data={data} />
            <Separator mb={"5"} size={"4"} />
            <div>
              <p>Subtotal</p>
              <p>₹{data.price}</p>
            </div>
            <div>
              <p>Delivery</p>
              <p>₹40</p>
            </div>
            <Separator mb={"5"} size={"4"} />
            <div style={{ marginBottom: "2rem" }}>
              <p>Total</p>
              <p>₹{data.price + 40}</p>
            </div>
            <Button mr={"6"}>Pay with COD</Button>
            <Button color="green" disabled>
              Pay Online
            </Button>
          </div>
        ) : (
          <div className="checkout_">
            <p>Your Order</p>

            {cartItems?.map((item: any, i: number) => {
              return <OrderCard key={i} data={item} />;
            })}
            <Separator mb={"5"} size={"4"} />
            <div>
              <p>Subtotal</p>
              <p>₹{cart?.cartTotalPrice}</p>
            </div>
            <div>
              <p>Delivery</p>
              <p>₹40</p>
            </div>
            <Separator mb={"5"} size={"4"} />
            <div style={{ marginBottom: "2rem" }}>
              <p>Total</p>
              <p>₹{(cart?.cartTotalPrice as number) + 40}</p>
            </div>
            <Button mr={"6"}>Pay with COD</Button>
            <Button color="green" disabled>
              Pay Online
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default Checkout;
