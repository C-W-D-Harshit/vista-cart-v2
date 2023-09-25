import React from "react";

const page = ({
  searchParams: { orderId, paymentId },
}: {
  searchParams: { orderId: string; paymentId: string };
}) => {
  return (
    <div>
      <h1>Order completed</h1>
      <h2>Order ID: {orderId}</h2>
      <h3>Transaction Id: {paymentId}</h3>
    </div>
  );
};

export default page;
