import { Separator } from "@radix-ui/themes";
import React from "react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <div className="account">
      <h2>Your Order</h2>
      <p>
        Manage & view your <strong>Order</strong>...
      </p>
      <Separator size={"4"} mb={"4"} mt={"4"} />

      <div className="account_order">
        <h1>Order ID: {id}</h1>
      </div>
    </div>
  );
};

export default Page;
