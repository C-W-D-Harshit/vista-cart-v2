"use client";

import axios from "axios";
import React, { useState } from "react";
import useSWR from "swr";
import "@/styles/admin/customers.scss";
import Image from "next/image";
import Loader from "@/components/essentials/Loader";
import { Badge, Select } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  // get data
  const api = axios.create({
    baseURL: ``,
  });

  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const fetcher = (url: string) => api.get(url).then((res) => res.data);
  const {
    data: ordersData,
    error: ordersError,
    mutate: ordersMutate,
    isLoading: ordersIsLoading,
  } = useSWR(`/api/user/${id}/orders`, fetcher);

  const { data, error, mutate, isLoading } = useSWR(`/api/user/${id}`, fetcher);
  if (isLoading || ordersIsLoading || !data || !ordersData) {
    return (
      <div
        style={{
          width: "100%",
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  const handleStatus = async (value: string) => {
    await axios.patch(`/api/user/${id}`, {
      status: value,
      role: data.user.role,
    });
    mutate();
  };
  const handleRole = async (value: string) => {
    await axios.patch(`/api/user/${id}`, {
      status: data.user.status,
      role: value,
    });
    mutate();
  };
  return (
    <div className="customers">
      <div>
        <p>Basic Information</p>
        <div className="customerInfoCard">
          <div className="customerInfoCard_img">
            <Image src="/profil.png" width={100} height={100} alt="user Img" />
          </div>
          <div className="customerInfoCard_">
            <p>{data.user.name}</p>
            <p>{data.user.email}</p>
          </div>
        </div>
        <div className="customerInfo">
          <div>
            <p>User ID</p>
            <p>{data.user._id}</p>
          </div>
          <div>
            <p>User Status</p>
            <Select.Root
              size={"3"}
              onValueChange={(value) => {
                handleStatus(value);
              }}
              defaultValue={data.user.status}
              defaultOpen={false}
              required
            >
              <Select.Trigger placeholder="Select a Status for Product…" />
              <Select.Content position="popper">
                <Select.Item value="active">
                  <Badge color="green" size={"2"}>
                    <p>Active</p>
                  </Badge>
                </Select.Item>
                <Select.Item value="blocked">
                  <Badge color="red" size={"2"}>
                    <p>Blocked</p>
                  </Badge>
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <p>Role</p>
            <Select.Root
              size={"3"}
              onValueChange={(value) => {
                handleRole(value);
              }}
              defaultValue={data.user.role}
              defaultOpen={false}
              required
            >
              <Select.Trigger placeholder="Select a Status for Product…" />
              <Select.Content position="popper">
                <Select.Item value="admin">
                  <Badge color="blue" size={"2"}>
                    <p>Admin</p>
                  </Badge>
                </Select.Item>
                <Select.Item value="user">
                  <Badge color="gray" size={"2"}>
                    <p>User</p>
                  </Badge>
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          <div>
            <p>Mobile Number</p>
            <p>{data.user.phoneNumber ? data.user.phoneNumber : "-"}</p>
          </div>
          <div>
            <p>Address</p>
            <p>
              {data.user.address
                ? `${data.user.address.address}, ${data.user.address.city}, ${data.user.address.state}, ${data.user.address.postalCode}`
                : "-"}
            </p>
          </div>
          <div>
            <p>Total Orders</p>
            <p>{ordersData?.totalOrders > 0 ? ordersData?.totalOrders : "-"}</p>
          </div>
        </div>
      </div>
      <div className="customers__orders">
        <p>Coming soon...</p>
      </div>
    </div>
  );
};

export default Page;
