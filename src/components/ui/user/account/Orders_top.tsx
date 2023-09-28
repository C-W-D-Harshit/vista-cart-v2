"use client";

import { Select } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const Orders_top = ({ status }: { status: string }) => {
  return (
    <div className="account_orders_top">
      <div>
        <Link
          href="/account/orders?status=completed"
          className={status === "completed" || status === "" ? "active_ao" : ""}
        >
          <p>Orders</p>
        </Link>
        <Link
          href="/account/orders?status=pending"
          className={status === "pending" ? "active_ao" : ""}
        >
          <p>Not Yet Shipped</p>
        </Link>
        <Link
          href="/account/orders?status=cancelled"
          className={status === "cancelled" ? "active_ao" : ""}
        >
          <p>Cancelled Orders</p>
        </Link>
      </div>
      <Select.Root defaultValue="3m" size={"3"}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="3m">Past 3 Month</Select.Item>
          <Select.Item value="12m">Past 12 Month </Select.Item>
          <Select.Item value="">All</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default Orders_top;
