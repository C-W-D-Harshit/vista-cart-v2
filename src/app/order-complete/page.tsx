"use client";

import React, { Suspense, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "@/animations/order-complete.json";
import "@/styles/user/orderCompleted.scss";
import { useRouter } from "next/navigation";

const Page = ({
  searchParams: { orderId, paymentId },
}: {
  searchParams: { orderId: string; paymentId: string };
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    setScale: 1.5,
  };
  return (
    <div className="orderCompleted">
      <div className="orderCompleted__anim">
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          style={{ scale: "1.5" }}
        />
      </div>
      <h1>Order Completed</h1>
      <h2>Order ID: {orderId}</h2>
    </div>
  );
};

export default Page;
