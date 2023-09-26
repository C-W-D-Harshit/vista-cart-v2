import React from "react";
import "@/styles/user/checkout.scss";
import Checkout from "@/components/ui/user/Checkout/Checkout";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/models/user";

async function getData(slug: string) {
  const res = await fetch(`${process.env.URL}/api/products/${slug}`, {
    cache: "force-cache",
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
  const session: any = await getServerSession();

  // if not session then
  if (!session) {
    throw new Error(`No Session`);
  }

  // lets find the user in DB
  // We would be using email because thats what we are getting from session
  let user = null;
  try {
    user = await User.findOne({ email: session.user.email });
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

const Page = async ({
  searchParams: { product, ref },
}: {
  searchParams: { product: string; ref: string };
}) => {
  let user = await getUser();

  user = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  user = JSON.parse(JSON.stringify(user));
  let data: any = {};
  if (ref === "buyNow") {
    data = await getData(product);
    data = data.product;
  }
  return <Checkout user={user} data={data} refral={ref} />;
};

export default Page;

export const runtime = "edge";
