"use client";

import React from "react";
import "@/styles/admin/orders.scss";
import axios from "axios";
import useSWR from "swr";
import Loader from "@/components/essentials/Loader";
import { Badge } from "@radix-ui/themes";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  // get search data
  const api = axios.create({
    baseURL: ``,
  });

  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const fetcher = (url: string) => api.get(url).then((res) => res.data);
  const { data, error, mutate, isLoading } = useSWR(
    `/api/order/${id}`,
    fetcher
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error) return <div>Failed to load</div>;
  function formatDateToLongFormat(timestamp: number): string {
    const createdAt = new Date(timestamp); // No need to multiply by 1000 if it's in milliseconds

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = createdAt.getDate();
    const month = months[createdAt.getMonth()];
    const year = createdAt.getFullYear();

    return `${month} ${day}, ${year}`;
  }
  return (
    <div className="adminOrder">
      <h3>Order ID: {id}</h3>
      <div className="adminOrder_">
        <div>
          <div className="adminOrder_info">
            <p>Order Info</p>
            <div>
              <div>
                <p>Date</p>
                <p>{formatDateToLongFormat(data.order.createdAt)}</p>
              </div>
              <div>
                <p>Items</p>
                <p>{data.order.products.length}</p>
              </div>
              <div>
                <p>Payment Status</p>
                <Badge
                  size={"2"}
                  color={data.order.paymentStatus === "paid" ? "green" : "red"}
                >
                  {data.order.paymentStatus}
                </Badge>
              </div>
              <div>
                <p>Status</p>
                <p></p>
                <Badge
                  size={"2"}
                  color={
                    data.order.status === "completed"
                      ? "green"
                      : data.order.status === "shipped"
                      ? "orange"
                      : "red"
                  }
                >
                  {data.order.status}
                </Badge>
              </div>
              <div>
                <p>Total</p>
                <p>₹{data.order.totalPrice}</p>
              </div>
            </div>
          </div>
          <div className="adminOrder_cus">
            <p>Customer Info</p>
            <div>
              <p>
                <strong>Name:</strong> {data.order.address.name}
              </p>
              <p>
                <strong>Email:</strong> {data.order.address.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {data.order.address.phoneNumber}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div></div>
          <div className="adminOrder_cus">
            <p>Shipping Address</p>
            <div>
              <p>
                {data.order.address.address}, {data.order.address.city},{" "}
                {data.order.address.state}, {data.order.address.postalCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
