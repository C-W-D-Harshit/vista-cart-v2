import React from "react";
import "@/styles/user/checkout.scss";
import Checkout from "@/components/ui/user/Checkout/Checkout";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { headers } from "next/headers";

async function getData(slug: string) {
  const res = await fetch(`${process.env.URL}/api/products/${slug}`, {
    next: { revalidate: 60 },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getUser() {
  const header = headers();
  const res = await fetch(`${process.env.URL}/api/user/me`, {
    // cache: "force-cache",
    method: "GET",
    headers: header,
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  // const data: any = await res.json();
  // const user_ = {
  //   ...data.user,
  // };
  // const user = {
  //   id: user_._id,
  //   name: user_.name,
  //   email: user_.email,
  // };

  // return user;
  return res.json();
}

const Page = async ({
  searchParams: { product, ref },
}: {
  searchParams: { product: string; ref: string };
}) => {
  let user: any = await getUser();

  user = {
    ...user.user,
  };
  user = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  // console.log(user);

  // user = JSON.parse(JSON.stringify(user));
  let data: any = {};
  if (ref === "buyNow") {
    data = await getData(product);
    data = data.product;
  }
  return <Checkout user={user} data={data} refral={ref} />;
  // return <h1>Hi</h1>;
};

export default Page;

export const revalidate = 0;
